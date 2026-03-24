import express from "express";
import processRoutes from "./routes/processRoutes.js";
import "./utils/cleanup.js";

const app = express();

app.use("/api", processRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});