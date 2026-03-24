// services/pdfToImage.js
import { exec } from "child_process";
import path from "path";
import fs from "fs-extra";

export const convertPDFToImages = (pdfPath, jobId) => {
  return new Promise((resolve, reject) => {
    const outputDir = `temp/${jobId}`;
    fs.ensureDirSync(outputDir);

    const cmd = `pdftoppm -png ${pdfPath} ${outputDir}/page`;

    exec(cmd, (err) => {
      if (err) return reject(err);

      const files = fs.readdirSync(outputDir)
        .filter(f => f.endsWith(".png"))
        .map(f => path.join(outputDir, f));

      resolve(files);
    });
  });
};