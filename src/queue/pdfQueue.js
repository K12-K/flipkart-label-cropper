// src/queue/pdfQueue.js
import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const pdfQueue = new Queue("pdf-processing", {
  connection,
});