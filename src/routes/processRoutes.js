// routes/processRoutes.js
import express from "express";
import multer from "multer";
import { processPDF } from "../controllers/processController.js";
import { pdfQueue } from "../queue/pdfQueue.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/process", upload.single("file"), processPDF);

// Check status
router.get("/status/:jobId", async (req, res) => {
  const job = await pdfQueue.getJob(req.params.jobId);
  console.log(req.params.jobId, job)

  if (!job) {
    return res.status(404).json({ status: "not found" });
  }

  const state = await job.getState();

  let result = null;
  if (state === "completed") {
    result = job.returnvalue;
  }

  res.json({
    status: state,
    progess: job.progress,
    result,
  });
});

export default router;