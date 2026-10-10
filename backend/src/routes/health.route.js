import { Router } from "express";
import { prisma } from "../config/database.js";
import { llmHealth } from "../services/llm.service.js";

const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

healthRouter.get("/db", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ success: true, data: { database: "connected" } });
});

healthRouter.get("/llm", async (_req, res) => {
  try {
    await llmHealth();
    res.json({ success: true, data: { llm: "reachable" } });
  } catch {
    res.status(503).json({ success: false, error: { message: "LLM not reachable", code: "LLM_DOWN" } });
  }
});
export default healthRouter;