// src/queue/worker.js
import { Worker } from "bullmq";
import "../config/env.js"
import { connection } from "./connection.js";

import { downloadFromR2 } from "../services/r2Download.js";
import { uploadToR2 } from "../services/r2Upload.js";
import { getPublicUrl } from "../services/r2Upload.js";

import { convertPDFToImages } from "../services/pdfToImage.js";
import { cropLabels } from "../services/cropService.js";
import { generatePDF } from "../services/pdfGenerator.js";

import fs from "fs";
import path from "path";

const worker = new Worker(
  "pdf-processing",
  async (job) => {
    const { r2Key, jobId, type } = job.data;

    console.log(`🚀 Processing job: ${jobId}`);

    const tempDir = `temp/${jobId}`;
    const localInput = `${tempDir}/input.pdf`;

    // ensure temp dir
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // 🔽 1. Download from R2
      await job.updateProgress(5);
      await downloadFromR2(r2Key, localInput);

      // 🖼️ 2. Convert PDF → images
      await job.updateProgress(20);
      const images = await convertPDFToImages(localInput, jobId);

      // ✂️ 3. Crop labels
      await job.updateProgress(50);
      const cropped = await cropLabels(images, jobId);

      // 📄 4. Generate PDF
      await job.updateProgress(75);
      const outputPath = await generatePDF(cropped, type, jobId);

      // ☁️ 5. Upload to R2
      const outputKey = `output/${jobId}.pdf`;
      await uploadToR2(outputPath, outputKey);

      await job.updateProgress(100);

      return {
        url: getPublicUrl(outputKey),
      };
    } catch (err) {
      console.error(`❌ Job failed: ${jobId}`, err);
      throw err; // IMPORTANT for retries
    } finally {
      // 🧹 Cleanup temp files
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        console.warn("Cleanup failed", e);
      }
    }
  },
  {
    connection,
    concurrency: 2, // 🔥 tune this based on CPU/RAM
    limiter: {
      max: 5,        // max jobs
      duration: 1000 // per second
    },
  }
);

worker.on("completed", (job, result) => {
  console.log(`✅ Job ${job.id} completed`);
  console.log("Result:", result);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed`);
  console.error(err);
});

worker.on("progress", (job, progress) => {
  console.log(`📊 Job ${job.id} progress: ${progress}%`);
});

worker.on("active", (job) => {
  console.log(`⚡ Job ${job.id} started`);
});

worker.on("stalled", (jobId) => {
  console.warn(`⚠️ Job stalled: ${jobId}`);
});