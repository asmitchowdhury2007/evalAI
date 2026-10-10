import {Router} from "express"
import authRouter from "./auth.route.js";
import uploadRouter from "./upload.routes.js";
//import chatRoutes from "./chat.routes.js";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use("/uploads",uploadRouter)
//apiRouter.use("/chat", chatRoutes);
//apiRouter.use("/students", studentRoutes);
//apiRouter.use("/dashboard", dashboardRoutes);

export default apiRouter