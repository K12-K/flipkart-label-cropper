// src/services/r2Download.js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { r2 } from "../config/r2.js";

export const downloadFromR2 = async (key, localPath) => {
  const response = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    })
  );

  const stream = response.Body;

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(localPath);

    stream.pipe(writeStream);
    stream.on("error", reject);
    writeStream.on("finish", resolve);
  });
};