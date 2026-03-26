// src/controllers/processController.js
import { pdfQueue } from "../queue/pdfQueue.js";
import { v4 as uuidv4 } from "uuid";

export const processPDF = async (req, res) => {
  try {
    const filePath = req.file.path;
    const type = req.body.type;

    const jobId = uuidv4();

    await pdfQueue.add(
      "process-pdf",
      {
        filePath,
        type,
        jobId,
      },
      {
        jobId,
        attempts: 3,
        // removeOnComplete: true,
        removeOnComplete: {
          age: 3600, // keep for 1 hour
        },
        removeOnFail: false,
      }
    );

    res.json({
      message: "Processing started",
      jobId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create job");
  }
};