// src/queue/connection.js
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis({
  // host: "127.0.0.1",
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  port: process.env.REDIS_PORT,
  // host: process.env.REDIS_HOST // production (Railway)
  // port: 6379,
});