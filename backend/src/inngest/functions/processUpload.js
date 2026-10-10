import { NonRetriableError } from "inngest";
import { inngest } from "../client.js";
import { prisma } from "../../config/database.js";
import { extractStudents } from "../../services/extractor.service.js";
import { analyzeAndSave } from "../../services/processing.service.js";

export const processUpload = inngest.createFunction(
  {
    id: "process-upload",
    retries: 2,
    concurrency: { limit: 1 },
    onFailure: async ({ event, error }) => {
      const uploadId = event.data.event.data.uploadId;
      await prisma.upload.update({
        where: { id: uploadId },
        data: { status: "FAILED", error: String(error.message).slice(0, 300) },
      });
    },
  },
  { event: "upload/created" },
  async ({ event, step }) => {
    const { uploadId } = event.data;

   
    const records = await step.run("extract-students", async () => {
      const upload = await prisma.upload.update({
        where: { id: uploadId },
        data: { status: "PROCESSING" },
      });
      const found = await extractStudents(upload.rawText);
      if (found.length === 0) {
        throw new NonRetriableError(
          "Could not find any students. Use the format: Name: ... then Feedback: ..."
        );
      }
      return found;
    });

    
    for (let i = 0; i < records.length; i++) {
      await step.run(`analyze-${i}`, () => analyzeAndSave(uploadId, records[i]));
    }

    
    await step.run("finalize", async () => {
      const upload = await prisma.upload.update({
        where: { id: uploadId },
        data: { status: "DONE", studentCount: records.length },
      });
      const msg = await prisma.message.findFirst({ where: { uploadId } });
      if (msg) {
        await prisma.message.create({
          data: {
            conversationId: msg.conversationId,
            role: "ASSISTANT",
            content: `I analyzed ${upload.fileName}: ${records.length} student(s) processed. Ask me who is most stressed, or for a class summary.`,
          },
        });
      }
    });

    return { uploadId, students: records.length };
  }
);