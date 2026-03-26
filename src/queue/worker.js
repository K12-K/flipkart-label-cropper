// src/queue/worker.js
import { Worker } from "bullmq";
import { connection } from "./connection.js";

import { convertPDFToImages } from "../services/pdfToImage.js";
import { cropLabels } from "../services/cropService.js";
import { generatePDF } from "../services/pdfGenerator.js";

const worker = new Worker(
  "pdf-processing",
  async (job) => {
    const { filePath, type, jobId } = job.data;

    console.log(`Processing job: ${jobId}`);

    // Step 1: PDF → images
    const images = await convertPDFToImages(filePath, jobId);

    // Step 2: Crop
    const cropped = await cropLabels(images, jobId);

    // Step 3: Generate final PDF
    const outputPath = await generatePDF(cropped, type, jobId);

    return {
      outputPath,
    };
  },
  {
    connection,
    concurrency: 2, // 🔥 controls load
  }
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`, result);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});