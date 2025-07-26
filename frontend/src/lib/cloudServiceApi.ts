interface GSAPEODRequest {
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

interface GSAPMonthlyRequest {
  siteId: string;
  year: string;
  month: string;
  sftpUser: string;
  bucketName: string;
}

interface FileUploadResponse {
  success: boolean;
  fileName: string;
  s3Path: string;
  uploadedAt: string;
  error?: string;
}

interface OutputFileMatch {
  triggerFileName: string;
  outputFiles: Array<{
    key: string;
    lastModified: Date;
    size: number;
    etag: string;
  }>;
  serviceType: string;
  generatedAt?: Date;
}

interface FileContentResponse {
  fileName: string;
  content: string;
  contentType: string;
  size: number;
}

class CloudServiceAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    credentials?: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      sessionToken?: string;
    }
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add AWS credentials to headers if provided
    if (credentials) {
      headers['x-aws-access-key-id'] = credentials.accessKeyId;
      headers['x-aws-secret-access-key'] = credentials.secretAccessKey;
      headers['x-aws-region'] = credentials.region;
      if (credentials.sessionToken) {
        headers['x-aws-session-token'] = credentials.sessionToken;
      }
    }

    const response = await fetch(`${this.baseURL}/cloud-services${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async generateGSAPEODFile(
    request: GSAPEODRequest,
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      sessionToken?: string;
    }
  ): Promise<FileUploadResponse> {
    return this.makeRequest<FileUploadResponse>(
      '/gsap-eod/generate',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      credentials
    );
  }

  async generateGSAPMonthlyFile(
    request: GSAPMonthlyRequest,
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      sessionToken?: string;
    }
  ): Promise<FileUploadResponse> {
    return this.makeRequest<FileUploadResponse>(
      '/gsap-monthly/generate',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      credentials
    );
  }

  async monitorOutputFiles(
    serviceType: string,
    bucketName: string,
    sftpUser: string,
    triggerFileName: string,
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      sessionToken?: string;
    }
  ): Promise<OutputFileMatch> {
    const params = new URLSearchParams({
      serviceType,
      bucketName,
      sftpUser,
      triggerFileName,
    });

    return this.makeRequest<OutputFileMatch>(
      `/outputs/monitor?${params}`,
      { method: 'GET' },
      credentials
    );
  }

  async getFileContent(
    bucketName: string,
    filePath: string,
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      sessionToken?: string;
    }
  ): Promise<FileContentResponse> {
    const params = new URLSearchParams({
      bucketName,
      filePath,
    });

    return this.makeRequest<FileContentResponse>(
      `/outputs/content?${params}`,
      { method: 'GET' },
      credentials
    );
  }

  async listOutputFiles(
    bucketName: string,
    exportPath: string,
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      sessionToken?: string;
    }
  ): Promise<{ files: Array<{ key: string; lastModified: Date; size: number; etag: string }> }> {
    const params = new URLSearchParams({
      bucketName,
      exportPath,
    });

    return this.makeRequest<{ files: Array<{ key: string; lastModified: Date; size: number; etag: string }> }>(
      `/outputs/list?${params}`,
      { method: 'GET' },
      credentials
    );
  }
}

export const cloudServiceAPI = new CloudServiceAPI();
export type { GSAPEODRequest, GSAPMonthlyRequest, FileUploadResponse, OutputFileMatch, FileContentResponse }; 