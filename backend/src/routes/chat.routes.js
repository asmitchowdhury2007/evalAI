import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import * as uploadController from "../controllers/upload.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { uploadPdf } from "../middleware/upload.js";
import {
  createConversationSchema,
  conversationIdSchema,
  sendMessageSchema,
} from "../validators/chat.validator.js";

const chatRouter = Router();


chatRouter.use(authenticate);


chatRouter.post("/conversations", validate(createConversationSchema), chatController.createConversation);
chatRouter.get("/conversations", chatController.listConversations);


chatRouter.get("/conversations/:id/messages", validate(conversationIdSchema), chatController.getMessages);
chatRouter.post("/conversations/:id/messages", validate(sendMessageSchema), chatController.sendMessage);


chatRouter.post("/conversations/:id/upload", uploadPdf, uploadController.createUpload);

export default chatRouter;