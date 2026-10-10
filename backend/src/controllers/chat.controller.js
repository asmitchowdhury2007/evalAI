import * as chatService from "../services/chat.service.js";
import { sendSuccess } from "../utils/response.js";

export const createConversation = async (req, res) => {
  sendSuccess(res, await chatService.createConversation(req.user.id, req.body.title), 201);
};

export const listConversations = async (req, res) => {
  sendSuccess(res, await chatService.listConversations(req.user.id));
};

export const getMessages = async (req, res) => {
  sendSuccess(res, await chatService.getMessages(req.user.id, req.params.id));
};

export const sendMessage = async (req, res) => {
  sendSuccess(
    res,
    await chatService.sendMessage(req.user.id, req.params.id, req.body.content),
    201
  );
};