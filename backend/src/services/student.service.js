import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

export async function listStudentsWithLatest(teacherId) {
  const students = await prisma.student.findMany({
    where: { teacherId },
    include: { analyses: { orderBy: { createdAt: "desc" }, take: 1 } },
    orderBy: { name: "asc" },
  });
  return students.map(({ analyses, ...s }) => ({ ...s, latest: analyses[0] ?? null }));
}

export async function getStudent(teacherId, id) {
  const student = await prisma.student.findFirst({
    where: { id, teacherId },
    include: { analyses: { orderBy: { createdAt: "asc" } } },
  });
  if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");
  return student;
}

export async function updateStudent(teacherId, id, data) {
  await getStudent(teacherId, id);
  return prisma.student.update({ where: { id }, data });
}

export async function deleteStudent(teacherId, id) {
  await getStudent(teacherId, id);
  await prisma.student.delete({ where: { id } });
}

export async function dashboardSummary(teacherId) {
  const students = await listStudentsWithLatest(teacherId);
  const analyzed = students.filter((s) => s.latest);
  const risk = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  const sums = { stress: 0, anxiety: 0, frustration: 0, disengagement: 0, overload: 0 };

  for (const s of analyzed) {
    risk[s.latest.risk]++;
    for (const k of Object.keys(sums)) sums[k] += s.latest[k];
  }
  const averages = {};
  for (const k of Object.keys(sums)) {
    averages[k] = analyzed.length ? Math.round(sums[k] / analyzed.length) : 0;
  }

  const highRisk = analyzed
    .filter((s) => s.latest.risk === "HIGH")
    .map((s) => ({ id: s.id, name: s.name, summary: s.latest.summary }));

  return { totalStudents: students.length, analyzed: analyzed.length, risk, averages, highRisk };
}