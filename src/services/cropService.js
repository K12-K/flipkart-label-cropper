// services/cropService.js
import sharp from "sharp";
import path from "path";
import fs from "fs-extra";

export const cropLabels = async (images, jobId) => {
  const outputDir = `temp/${jobId}/cropped`;
  fs.ensureDirSync(outputDir);

  const results = [];

  // Fixed crop region (Flipkart label)
  const cropRegion = {
    // left: 190,
    // top: 28,
    // width: 215,
    // height: 357,
    left: 380, // 389
    top: 45, // 50 (50 will also work, just to clear works even better in 50 to exact center, but using 45 for adding some kind of space at top if printing directly in gum-stip label printer)
    width: 480, // 446
    height: 750, // 742
  };

  for (let i = 0; i < images.length; i++) {
    const outputPath = path.join(outputDir, `crop-${i}.png`);

    await sharp(images[i])
      .extract(cropRegion)
      .png()
      .toFile(outputPath);

    results.push(outputPath);
  }

  return results;
};