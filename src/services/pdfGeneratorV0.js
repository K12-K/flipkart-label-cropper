// services/pdfGenerator.js
import { PDFDocument } from "pdf-lib";
import fs from "fs-extra";

export const generatePDF = async (images, type, jobId) => {
  const pdfDoc = await PDFDocument.create();

  for (const imgPath of images) {
    const imgBytes = fs.readFileSync(imgPath);
    const image = await pdfDoc.embedPng(imgBytes);

    let page;

    if (type === "label") {
      // 4x6 inches → 288 x 432 points
      page = pdfDoc.addPage([288, 432]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: 288,
        height: 432
      });
    } else {
      // A4
      page = pdfDoc.addPage([595, 842]);

      page.drawImage(image, {
        x: 50,
        y: 400,
        width: 500,
        height: 300
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = `output/${jobId}.pdf`;

  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
};