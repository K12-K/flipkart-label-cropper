// src/config/env.js
import dotenv from "dotenv";
import { cleanEnv, str, num } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  PORT: num(),
  REDIS_HOST: str(),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  REDIS_PORT: num(),
  R2_ENDPOINT: str(),
  R2_ACCESS_KEY: str(),
  R2_SECRET_KEY: str(),
  R2_BUCKET: str(),
  R2_PUBLIC_URL: str(),
});