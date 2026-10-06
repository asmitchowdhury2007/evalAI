import {Router} from "express"

const authRouter = Router();

authRouter.post("/onboard", authenticate, validate(onboardSchema), onboard);
authRouter.get("/me", authenticate, me);

export default authRouter;

