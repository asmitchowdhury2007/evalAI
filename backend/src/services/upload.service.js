import pdf from "pdf-parse/lib/pdf-parse.js";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { inngest } from "../inngest/client.js";

export async function createUpload(teacherId, conversationId, file) {
  if (!file) throw new ApiError(400, "Attach a PDF in the 'file' field", "NO_FILE");

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, teacherId },
  });
  if (!conversation) throw new ApiError(404, "Conversation not found", "NOT_FOUND");

  const parsed = await pdf(file.buffer);
  const text = parsed.text.trim();
  if (text.length < 20) {
    throw new ApiError(422, "No readable text found. Scanned PDFs are not supported yet.", "EMPTY_PDF");
  }

  const upload = await prisma.upload.create({
    data: { teacherId, fileName: file.originalname, rawText: text },
  });

  await prisma.message.create({
    data: { conversationId, role: "USER", content: `Uploaded ${file.originalname}`, uploadId: upload.id },
  });

  await inngest.send({ name: "upload/created", data: { uploadId: upload.id } });

  return { id: upload.id, fileName: upload.fileName, status: upload.status };
}

export async function getUpload(teacherId, id) {
  const upload = await prisma.upload.findFirst({
    where: { id, teacherId },
    select: { id: true, fileName: true, status: true, studentCount: true, error: true, createdAt: true },
  });
  if (!upload) throw new ApiError(404, "Upload not found", "NOT_FOUND");
  return upload;
}

export async function getUploadResults(teacherId, id) {
  await getUpload(teacherId, id);
  const feedbacks = await prisma.feedback.findMany({
    where: { uploadId: id },
    include: { student: { select: { id: true, name: true } }, analysis: true },
    orderBy: { createdAt: "asc" },
  });
  return feedbacks.map((f) => ({
    studentId: f.student.id,
    studentName: f.student.name,
    feedback: f.text,
    analysis: f.analysis,
  }));
}