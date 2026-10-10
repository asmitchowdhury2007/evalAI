import rateLimit from "express-rate-limit";

const base = { standardHeaders: "draft-7", legacyHeaders: false };

const handler = (_req, res) =>
  res.status(429).json({
    success: false,
    error: { message: "Too many requests. Please slow down.", code: "RATE_LIMITED" },
  });


export const globalLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, limit: 300, handler });


export const chatLimiter = rateLimit({
  ...base, windowMs: 60 * 1000, limit: 20,
  keyGenerator: (req) => req.user.id, handler,
});


export const uploadLimiter = rateLimit({
  ...base, windowMs: 60 * 60 * 1000, limit: 10,
  keyGenerator: (req) => req.user.id, handler,
});