import {Router} from "express"
import authRouter from "./auth.route.js";
import uploadRouter from "./upload.routes.js";
import studentRouter from "./student.routes.js";
import dashboardRouter from "./dashboard.routes.js";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use("/uploads",uploadRouter)
//apiRouter.use("/chat", chatRoutes);
apiRouter.use("/students", studentRouter);
apiRouter.use("/dashboard", dashboardRouter);

export default apiRouter