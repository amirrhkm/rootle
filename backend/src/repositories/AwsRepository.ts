import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { IAwsRepository } from '../interfaces';
import { AWSCredentials, AWSValidationResponse } from '../types';

export class AwsRepository implements IAwsRepository {
  async validateCredentials(credentials: AWSCredentials): Promise<AWSValidationResponse> {
    try {
      const { accessKeyId, secretAccessKey, region, sessionToken } = credentials;

      const awsCredentials = {
        accessKeyId,
        secretAccessKey,
        ...(sessionToken && { sessionToken })
      };

      const stsClient = new STSClient({
        region,
        credentials: awsCredentials
      });

      const command = new GetCallerIdentityCommand({});
      const response = await stsClient.send(command);

      return {
        isValid: true,
        accountId: response.Account,
        username: response.Arn?.split('/').pop() || 'Unknown',
        arn: response.Arn,
        checkedAt: new Date().toISOString()
      };

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

      return {
        isValid: false,
        error: errorMessage,
        checkedAt: new Date().toISOString()
      };
    }
  }
} 