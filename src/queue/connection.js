// src/queue/connection.js
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis({
  // host: "127.0.0.1",
  host: "crossover.proxy.rlwy.net",
  username: "default",
  password: "qybsFAJEDcpCmuuiNXmUonfYBbfqqfZv",
  maxRetriesPerRequest: null,
  port: 45646,
  // host: process.env.REDIS_HOST // production (Railway)
  // port: 6379,
});