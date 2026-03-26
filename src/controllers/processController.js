// processController.js
import { v4 as uuidv4 } from "uuid";
import { pdfQueue } from "../queue/pdfQueue.js";
import { uploadToR2 } from "../services/r2Upload.js";

export const processPDF = async (req, res) => {
  const filePath = req.file.path;
  const jobId = uuidv4();

  const r2Key = `input/${jobId}.pdf`;

  // Upload to R2
  await uploadToR2(filePath, r2Key);

  // Add job
  await pdfQueue.add("process-pdf", {
    r2Key,
    jobId,
    type: req.body.type,
  }, {
    jobId,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    // removeOnComplete: true,
    removeOnComplete: {
      age: 3600, // keep for 1 hour
    },
    removeOnFail: false,
    timeout: 300000, // ⏱️ 5 min
  });

  res.json({ jobId });
};