import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Container } from "./container";
import { createHealthRoutes, createAwsRoutes } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const container = Container.getInstance();

app.use("/api", createHealthRoutes());
app.use("/api/aws", createAwsRoutes(container.getAwsService()));

app.listen(port, () => {
  console.log(`[Rootle API] Running on port ${port}`);
}); 