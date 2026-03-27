import express from "express";
import "./config/env.js"
import processRoutes from "./routes/processRoutes.js";
import "./utils/cleanup.js";

const app = express();

app.use("/api", processRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});