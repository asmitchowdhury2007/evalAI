import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { askLLM } from "./llm.service.js";
import { listStudentsWithLatest } from "./student.service.js";

async function getOwnedConversation(teacherId, id) {
  const conversation = await prisma.conversation.findFirst({ where: { id, teacherId } });
  if (!conversation) throw new ApiError(404, "Conversation not found", "NOT_FOUND");
  return conversation;
}

const fmt = (s) =>
  `${s.name}: risk ${s.latest.risk}, stress ${s.latest.stress}, anxiety ${s.latest.anxiety}, ` +
  `frustration ${s.latest.frustration}, disengagement ${s.latest.disengagement}, overload ${s.latest.overload}`;

async function generateReply(teacherId, userText) {
  const students = (await listStudentsWithLatest(teacherId)).filter((s) => s.latest);
  if (students.length === 0) {
    return "I have no analyzed students yet. Upload a feedback-form PDF and I'll analyze it.";
  }

  const text = userText.toLowerCase();
  const mentioned = students.find((s) => text.includes(s.name.toLowerCase()));

  let facts;
  if (mentioned) {
    facts = `${fmt(mentioned)}. ${mentioned.latest.summary ?? ""}`;
  } else {
    const metric =
      ["anxiety", "frustration", "disengagement", "overload"].find((k) => text.includes(k)) ?? "stress";
    if (/most|top|highest|worst|who|risk/.test(text)) {
      const top = [...students].sort((a, b) => b.latest[metric] - a.latest[metric]).slice(0, 5);
      facts = `Highest ${metric}:\n` + top.map(fmt).join("\n");
    } else {
      const high = students.filter((s) => s.latest.risk === "HIGH").length;
      const med = students.filter((s) => s.latest.risk === "MEDIUM").length;
      facts = `${students.length} students analyzed. High risk: ${high}. Medium risk: ${med}. Low risk: ${students.length - high - med}.`;
    }
  }

  if (env.USE_LLM === "true") {
    try {
      return await askLLM(
        `You assist a teacher. Answer using ONLY this data. These are indicators, not diagnoses.\n\nData:\n${facts}\n\nQuestion: ${userText}`
      );
    } catch {
      /* model unavailable, fall through to plain facts */
    }
  }
  return `${facts}\n\n(These are indicators from feedback text, not a diagnosis.)`;
}

export function createConversation(teacherId, title) {
  return prisma.conversation.create({
    data: { teacherId, title: title ?? "New chat" },
  });
}

export function listConversations(teacherId) {
  return prisma.conversation.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMessages(teacherId, conversationId) {
  await getOwnedConversation(teacherId, conversationId);
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function sendMessage(teacherId, conversationId, content) {
  await getOwnedConversation(teacherId, conversationId);

  const userMessage = await prisma.message.create({
    data: { conversationId, role: "USER", content },
  });

  const replyText = await generateReply(teacherId, content);

  const assistantMessage = await prisma.message.create({
    data: { conversationId, role: "ASSISTANT", content: replyText },
  });

  return { userMessage, assistantMessage };
}