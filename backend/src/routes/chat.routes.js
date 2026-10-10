import { uploadPdf } from "../middleware/upload.js";
import * as uploadController from "../controllers/upload.controller.js";

router.post("/conversations/:id/upload", uploadPdf, uploadController.createUpload);