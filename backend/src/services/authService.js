
import { clerkClient } from "@clerk/express";
import { prisma } from "../config/database.js";

export async function findOrCreateUser(clerkId) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const cu = await clerkClient.users.getUser(clerkId);
  const email = cu.emailAddresses[0]?.emailAddress ?? null;
  const name = [cu.firstName, cu.lastName].filter(Boolean).join(" ") || email || "Teacher";

  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId, email, name },
  });
}