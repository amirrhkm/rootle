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

// Cloud Service Types
export interface GSAPEODRequest {
  serviceType: 'EODSales' | 'POSSales';
  generationType: 'single' | 'range' | 'bulk';
  siteId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  bulkSites?: string[];
  sftpUser: string;
  bucketName: string;
}

export interface GSAPMonthlyRequest {
  siteId: string;
  year: string;
  month: string;
  sftpUser: string;
  bucketName: string;
}

export interface FileUploadResponse {
  success: boolean;
  fileName: string;
  s3Path: string;
  uploadedAt: string;
  error?: string;
}

export interface S3FileInfo {
  key: string;
  lastModified: Date;
  size: number;
  etag: string;
}

export interface OutputFileMatch {
  triggerFileName: string;
  outputFiles: S3FileInfo[];
  serviceType: string;
  generatedAt?: Date;
}

export interface FileContentResponse {
  fileName: string;
  content: string;
  contentType: string;
  size: number;
} 