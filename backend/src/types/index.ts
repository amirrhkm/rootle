export interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
}

export interface AWSValidationResponse {
  isValid: boolean;
  accountId?: string;
  username?: string;
  arn?: string;
  error?: string;
  checkedAt: string;
}

export interface HealthCheckResponse {
  status: string;
}

export interface InfoResponse {
  name: string;
  version: string;
  timestamp: string;
} 