// services/cropService.js
import sharp from "sharp";
import path from "path";
import fs from "fs-extra";

export const cropLabels = async (images, jobId) => {
  const outputDir = `temp/${jobId}/cropped`;
  fs.ensureDirSync(outputDir);

  const results = [];

  for (let i = 0; i < images.length; i++) {
    const outputPath = path.join(outputDir, `crop-${i}.png`);

    await sharp(images[i])
      .extract({
        left: 200,   // adjust after you test real PDF
        top: 100,
        width: 1000,
        height: 600
      })
      .toFile(outputPath);

    results.push(outputPath);
  }

  return results;
};