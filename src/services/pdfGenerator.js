// services/pdfGenerator.js
import { PDFDocument } from "pdf-lib";
import fs from "fs-extra";

export const generatePDF = async (images, type, jobId) => {
  const pdfDoc = await PDFDocument.create();

  const TARGET_WIDTH = 265;
  const TARGET_HEIGHT = 360;

  // =========================
  // 🏷️ SINGLE LABEL (Printer)
  // =========================
  if (type === "label") {
    for (const imgPath of images) {
      const page = pdfDoc.addPage([TARGET_WIDTH, TARGET_HEIGHT]);

      const imgBytes = fs.readFileSync(imgPath);
      const image = await pdfDoc.embedPng(imgBytes);

      // Maintain aspect ratio
      const scale = Math.min(
        TARGET_WIDTH / image.width,
        TARGET_HEIGHT / image.height
      );

      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;

      page.drawImage(image, {
        x: (TARGET_WIDTH - drawWidth) / 2,
        y: (TARGET_HEIGHT - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  // =========================
  // 📄 A4 - 4 LABELS PER PAGE
  // =========================
  else if (type === "a4-4") {
    const pageWidth = 595;
    const pageHeight = 842;

    const margin = 20;
    const gap = 10;

    let page = null;

    for (let i = 0; i < images.length; i++) {
      if (i % 4 === 0) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
      }

      const imgBytes = fs.readFileSync(images[i]);
      const image = await pdfDoc.embedPng(imgBytes);

      const pos = i % 4;

      let x, y;

      switch (pos) {
        case 0: // Top Left
          x = margin;
          y = pageHeight - margin - TARGET_HEIGHT;
          break;

        case 1: // Top Right
          x = margin + TARGET_WIDTH + gap;
          y = pageHeight - margin - TARGET_HEIGHT;
          break;

        case 2: // Bottom Left
          x = margin;
          y = margin;
          break;

        case 3: // Bottom Right
          x = margin + TARGET_WIDTH + gap;
          y = margin;
          break;
      }

      // Maintain aspect ratio
      const scale = Math.min(
        TARGET_WIDTH / image.width,
        TARGET_HEIGHT / image.height
      );

      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;

      page.drawImage(image, {
        x: x + (TARGET_WIDTH - drawWidth) / 2,
        y: y + (TARGET_HEIGHT - drawHeight) / 2,
        width: drawWidth,
        height: drawHeight,
      });
    }
  }

  // =========================
  // 💾 SAVE FILE
  // =========================
  const pdfBytes = await pdfDoc.save();
  const outputPath = `output/${jobId}.pdf`;

  fs.ensureDirSync("output");
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
};