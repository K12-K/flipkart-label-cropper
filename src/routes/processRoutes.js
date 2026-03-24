// routes/processRoutes.js
import express from "express";
import multer from "multer";
import { processPDF } from "../controllers/processController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/process", upload.single("file"), processPDF);

export default router;