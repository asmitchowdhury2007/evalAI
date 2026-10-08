import {Router} from "express"
import {onboard,me} from "../controllers/authController.js"
import {authenticate} from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.js";

const authRouter = Router();

authRouter.post("/onboard", authenticate, validate(onboardSchema), onboard);
authRouter.get("/me", authenticate, me);

export default authRouter;

