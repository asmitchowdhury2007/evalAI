import { prisma } from "../config/database.js";
import { analyzeText } from "./analysis.service.js";

export async function analyzeAndSave(uploadId, record) {
  const upload = await prisma.upload.findUnique({ where: { id: uploadId } });
  const teacherId = upload.teacherId;
  const name = record.name.trim();

  const student = await prisma.student.upsert({
    where: { teacherId_name: { teacherId, name } },
    update: {},
    create: { teacherId, name },
  });

  
  const existing = await prisma.feedback.findFirst({
    where: { uploadId, studentId: student.id },
  });
  if (existing) return { studentId: student.id, skipped: true };

  const feedback = await prisma.feedback.create({
    data: { uploadId, studentId: student.id, text: record.feedback },
  });

  const result = await analyzeText(record.feedback);

  await prisma.analysis.create({
    data: { feedbackId: feedback.id, studentId: student.id, ...result },
  });

  return { studentId: student.id, risk: result.risk };
}