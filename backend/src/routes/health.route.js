import { Router } from "express";
import { prisma } from "../config/database.js";

const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

healthRouter.get("/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ success: true, data: { database: "connected" } });
});

export default healthRouter;