import * as uploadService from "../services/upload.service.js";
import { sendSuccess } from "../utils/response.js";

export const createUpload = async (req, res) => {
  sendSuccess(res, await uploadService.createUpload(req.user.id, req.params.id, req.file), 202);
};
export const getUpload = async (req, res) => {
  sendSuccess(res, await uploadService.getUpload(req.user.id, req.params.id));
};
export const getUploadResults = async (req, res) => {
  sendSuccess(res, await uploadService.getUploadResults(req.user.id, req.params.id));
};

