import { Router } from "express";
import * as c from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const dashboardRouter = Router();
dashboardRouter.get("/summary", authenticate, c.summary);

export default dashboardRouter;