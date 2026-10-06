import {auth_onboarded} from "../services/authService.js"

export const onboard = async (req, res) => {
  sendSuccess(res, await auth_onboarded(req.clerkId, req.body), 201);
};
export const me = async (req, res) => {
  sendSuccess(res, { onboarded: !!req.user, user: req.user });
};

