import { clerkClient } from "@clerk/express";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";


export async function auth_onboarded(clerkId, { role }) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) throw new ApiError(409, "Already onboarded");

  const cu = await clerkClient.users.getUser(clerkId);
  const email = cu.emailAddresses[0].emailAddress;
  const name = [cu.firstName, cu.lastName].filter(Boolean).join(" ") || email;

  return prisma.user.create({ data: { clerkId, email, name, role } });
}