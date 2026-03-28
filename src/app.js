import express from "express";
import cors from "cors";
import "./config/env.js"
import processRoutes from "./routes/processRoutes.js";
import "./utils/cleanup.js";

const app = express();

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors())

app.use("/api", processRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});