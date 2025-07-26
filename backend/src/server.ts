import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Container } from "./container";
import { createHealthRoutes, createAwsRoutes, createCloudServiceRoutes } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize dependency injection container
const container = Container.getInstance();

// Setup routes
app.use("/api", createHealthRoutes());
app.use("/api/aws", createAwsRoutes(container.getAwsService()));
app.use("/api/cloud-services", createCloudServiceRoutes(
  container.getFileGeneratorService(),
  container.getS3Service()
));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 