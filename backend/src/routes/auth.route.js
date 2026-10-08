import {Router} from "express"
import {onboard,me} from "../controllers/authController.js"
import {authenticate} from "../middleware/auth.middleware.js"


const authRouter = Router();

authRouter.get("/me", authenticate, me);

export default authRouter;

