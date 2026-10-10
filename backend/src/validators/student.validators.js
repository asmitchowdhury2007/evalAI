import { z } from "zod";

const id = z.string().min(1);

export const studentIdSchema = z.object({ params: z.object({ id }) });

export const updateStudentSchema = z.object({
  params: z.object({ id }),
  body: z.object({
    name: z.string().trim().min(1).max(100).optional(),
    rollNo: z.string().trim().max(30).nullable().optional(),
  }),
});