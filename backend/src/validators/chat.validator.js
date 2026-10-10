import { z } from "zod";

const id = z.string().min(1);

export const createConversationSchema = z.object({
  body: z.object({ title: z.string().trim().min(1).max(100).optional() }).default({}),
});

export const conversationIdSchema = z.object({
  params: z.object({ id }),
});

export const sendMessageSchema = z.object({
  params: z.object({ id }),
  body: z.object({ content: z.string().trim().min(1).max(4000) }),
});