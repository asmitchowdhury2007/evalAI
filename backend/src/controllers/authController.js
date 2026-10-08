import { sendSuccess } from "../utils/response.js";

export const me = async (req, res) => {
  sendSuccess(res, req.user);
};

