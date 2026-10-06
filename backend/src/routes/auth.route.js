import {Router} from "express"

const authRouter = Router();

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRoter.put("/profilePic", profilePic);

authRouter.get("/check", checkAuth);

export default authRouter;

