import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, HeadObjectCommand, _Object } from "@aws-sdk/client-s3";
import { IS3Repository } from '../interfaces';
import { AWSCredentials, S3FileInfo, FileContentResponse } from '../types';

export class S3Repository implements IS3Repository {
  private createS3Client(credentials: AWSCredentials): S3Client {
    return new S3Client({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        ...(credentials.sessionToken && { sessionToken: credentials.sessionToken })
      }
    });
  }

  async uploadFile(
    credentials: AWSCredentials,
    bucketName: string,
    key: string,
    content: string,
    contentType: string = 'text/plain'
  ): Promise<void> {
    const s3Client = this.createS3Client(credentials);
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: content,
      ContentType: contentType
    });

    await s3Client.send(command);
  }

  async listFiles(
    credentials: AWSCredentials,
    bucketName: string,
    prefix: string
  ): Promise<S3FileInfo[]> {
    const s3Client = this.createS3Client(credentials);
    
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix
    });

    const response = await s3Client.send(command);
    
    return (response.Contents || []).map((obj: _Object) => ({
      key: obj.Key!,
      lastModified: obj.LastModified!,
      size: obj.Size!,
      etag: obj.ETag!.replace(/"/g, '')
    }));
  }

  async downloadFile(
    credentials: AWSCredentials,
    bucketName: string,
    key: string
  ): Promise<FileContentResponse> {
    const s3Client = this.createS3Client(credentials);
    
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const response = await s3Client.send(command);
    const content = await response.Body?.transformToString() || '';
    
    return {
      fileName: key.split('/').pop() || key,
      content,
      contentType: response.ContentType || 'text/plain',
      size: response.ContentLength || content.length
    };
  }

  async fileExists(
    credentials: AWSCredentials,
    bucketName: string,
    key: string
  ): Promise<boolean> {
    const s3Client = this.createS3Client(credentials);
    
    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key
      });
      
      await s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }
} 