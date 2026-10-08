
import { getAuth, clerkClient } from "@clerk/express";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";

export async function authenticate(req, _res, next) {
  const { userId } = getAuth(req);
  if (!userId) throw new ApiError(401, "Not authenticated");

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    const cu = await clerkClient.users.getUser(userId);
    const email = cu.emailAddresses[0]?.emailAddress;
    const name = [cu.firstName, cu.lastName].filter(Boolean).join(" ") || email;
    user = await prisma.user.create({ data: { clerkId: userId, email, name } });
  }

  req.user = user;
  next();
}