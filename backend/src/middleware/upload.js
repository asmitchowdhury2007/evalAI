import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

export const uploadPdf = multer({
  storage: multer.memoryStorage(), // keep in RAM, nothing is written to disk
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(new ApiError(400, "Only PDF files are allowed", "INVALID_FILE"));
  },
}).single("file");