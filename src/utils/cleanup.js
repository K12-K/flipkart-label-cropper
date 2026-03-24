// utils/cleanup.js
import cron from "node-cron";
import fs from "fs-extra";

const CLEANUP_TIME_HOURS = 3;

cron.schedule("0 * * * *", async () => {
  console.log("Running cleanup job...");

  const dirs = ["uploads", "temp", "output"];

  for (const dir of dirs) {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = `${dir}/${file}`;
      const stats = await fs.stat(filePath);

      const age = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60);

      if (age > CLEANUP_TIME_HOURS) {
        await fs.remove(filePath);
      }
    }
  }
});