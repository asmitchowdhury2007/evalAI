import { Router } from "express";
import * as c from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { studentIdSchema, updateStudentSchema } from "../validators/student.validator.js";

const studentRouter = Router();
studentRouter.use(authenticate);

studentRouter.get("/", c.list);
studentRouter.get("/:id", validate(studentIdSchema), c.getOne);
studentRouter.patch("/:id", validate(updateStudentSchema), c.update);
studentRouter.delete("/:id", validate(studentIdSchema), c.remove);

export default studentRouter;