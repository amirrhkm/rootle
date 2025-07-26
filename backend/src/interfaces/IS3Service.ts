import { AWSCredentials, FileUploadResponse, S3FileInfo, OutputFileMatch, FileContentResponse } from '../types';

export interface IS3Service {
  uploadTriggerFile(
    credentials: AWSCredentials,
    bucketName: string,
    fileName: string,
    content: string,
    importPath: string
  ): Promise<FileUploadResponse>;

  monitorOutputFiles(
    credentials: AWSCredentials,
    bucketName: string,
    exportPath: string,
    triggerFileName: string,
    serviceType: string
  ): Promise<OutputFileMatch>;

  getFileContent(
    credentials: AWSCredentials,
    bucketName: string,
    filePath: string
  ): Promise<FileContentResponse>;

  listOutputFiles(
    credentials: AWSCredentials,
    bucketName: string,
    exportPath: string
  ): Promise<S3FileInfo[]>;
} 