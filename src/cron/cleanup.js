// src/cron/cleanup.js // **** DEPRACRATED FLOW *****
import cron from "node-cron";
import fs from "fs";
import path from "path";

const TEMP_DIR = "temp/";

cron.schedule("0 * * * *", () => {
  console.log("🧹 Running temp cleanup...");

  try {
    if (!fs.existsSync(TEMP_DIR)) return;

    const folders = fs.readdirSync(TEMP_DIR);

    folders.forEach((folder) => {
      const fullPath = path.join(TEMP_DIR, folder);

      const stats = fs.statSync(fullPath);
      const age = Date.now() - stats.mtimeMs;

      // delete if older than 2 hours
      if (age > 2 * 60 * 60 * 1000) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log("Deleted:", fullPath);
      }
    });
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});