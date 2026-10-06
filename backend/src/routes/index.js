import {Router} from "express"
import authRouter from "./auth.route.js";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/messages', messageRouter);


export default apiRouter