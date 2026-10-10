import { Router } from "express";
import * as c from "../controllers/upload.controller.js";
import { authenticate } from "../middleware/auth.js";

const uploadRouter = Router();
uploadRouter.use(authenticate);

uploadRouter.get("/:id", c.getUpload);
uploadRouter.get("/:id/results", c.getUploadResults);

export default uploadRouter;