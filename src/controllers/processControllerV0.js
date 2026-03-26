// controllers/processController.js
import { convertPDFToImages } from "../services/pdfToImage.js";
import { cropLabels } from "../services/cropService.js";
import { generatePDF } from "../services/pdfGenerator.js";
import { v4 as uuidv4 } from "uuid";

export const processPDF = async (req, res) => {
  try {
    const filePath = req.file.path;
    const type = req.body.type; // 'label' or 'a4'

    const jobId = uuidv4();

    // 1. Convert PDF → images
    const images = await convertPDFToImages(filePath, jobId);

    // 2. Crop labels
    const croppedImages = await cropLabels(images, jobId);

    // 3. Generate output PDF
    const outputPath = await generatePDF(croppedImages, type, jobId);

    res.download(outputPath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Processing failed");
  }
};