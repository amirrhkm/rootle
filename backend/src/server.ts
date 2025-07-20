import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Basic info endpoint
app.get("/api/info", (req, res) => {
  res.json({ 
    name: "Rootle API",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// AWS credential validation endpoint
app.post("/api/aws/validate-credentials", async (req, res) => {
  try {
    const { accessKeyId, secretAccessKey, region, sessionToken } = req.body;

    if (!accessKeyId || !secretAccessKey || !region) {
      return res.status(400).json({
        isValid: false,
        error: "Missing required credentials (accessKeyId, secretAccessKey, region)",
        checkedAt: new Date().toISOString()
      });
    }

    // Create STS client with provided credentials
    const credentials = {
      accessKeyId,
      secretAccessKey,
      ...(sessionToken && { sessionToken })
    };

    const stsClient = new STSClient({
      region,
      credentials
    });

    // Try to get caller identity to validate credentials
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);

    res.json({
      isValid: true,
      accountId: response.Account,
      username: response.Arn?.split('/').pop() || 'Unknown',
      arn: response.Arn,
      checkedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("AWS credential validation error:", error);

    let errorMessage = "Invalid credentials";
    
    if (error.name === "InvalidUserID.NotFound") {
      errorMessage = "Access key not found";
    } else if (error.name === "SignatureDoesNotMatch") {
      errorMessage = "Invalid secret access key";
    } else if (error.name === "TokenRefreshRequired") {
      errorMessage = "Session token expired";
    } else if (error.name === "AccessDenied") {
      errorMessage = "Access denied - insufficient permissions";
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(401).json({
      isValid: false,
      error: errorMessage,
      checkedAt: new Date().toISOString()
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 