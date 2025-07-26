import { AWSCredentials, S3FileInfo, FileContentResponse } from '../types';

export interface IS3Repository {
  uploadFile(
    credentials: AWSCredentials,
    bucketName: string,
    key: string,
    content: string,
    contentType?: string
  ): Promise<void>;

  listFiles(
    credentials: AWSCredentials,
    bucketName: string,
    prefix: string
  ): Promise<S3FileInfo[]>;

  downloadFile(
    credentials: AWSCredentials,
    bucketName: string,
    key: string
  ): Promise<FileContentResponse>;

  fileExists(
    credentials: AWSCredentials,
    bucketName: string,
    key: string
  ): Promise<boolean>;
} 