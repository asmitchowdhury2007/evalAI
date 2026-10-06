export const onboard = async (req, res) => {
  sendSuccess(res, await authService.onboard(req.clerkId, req.body), 201);
};
export const me = async (req, res) => {
  sendSuccess(res, { onboarded: !!req.user, user: req.user });
};

