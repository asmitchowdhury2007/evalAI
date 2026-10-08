import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, "NOT_FOUND"));
}

export function errorHandler(err, _req, res, _next) {
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: err.flatten().fieldErrors,
      },
    });
  }

  
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: { message: "Record already exists", code: "CONFLICT" },
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { message: "Record not found", code: "NOT_FOUND" },
      });
    }
  }

 
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);

  res.status(status).json({
    success: false,
    error: {
      message: status === 500 ? "Internal server error" : err.message,
      code: err.code || (status === 500 ? "INTERNAL_ERROR" : undefined),
      ...(env.NODE_ENV === "development" && status === 500 ? { stack: err.stack } : {}),
    },
  });
}