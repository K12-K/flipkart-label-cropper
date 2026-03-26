// src/services/r2Upload.js
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { r2 } from "../config/r2.js";

export const uploadToR2 = async (filePath, key) => {
  const fileStream = fs.createReadStream(filePath);

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: fileStream,
      ContentType: "application/pdf",
    })
  );

  return key;
};

export const getPublicUrl = (key) => {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
};