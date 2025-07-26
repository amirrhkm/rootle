import { IAwsRepository, IAwsService, IS3Repository, IFileGeneratorService, IS3Service } from '../interfaces';
import { AwsRepository, S3Repository } from '../repositories';
import { AwsService, FileGeneratorService, S3Service } from '../services';

export class Container {
  private static instance: Container;
  private awsRepository: IAwsRepository;
  private awsService: IAwsService;
  private s3Repository: IS3Repository;
  private fileGeneratorService: IFileGeneratorService;
  private s3Service: IS3Service;

  private constructor() {
    // Initialize dependencies following the dependency chain
    this.awsRepository = new AwsRepository();
    this.awsService = new AwsService(this.awsRepository);
    
    // Cloud service dependencies
    this.s3Repository = new S3Repository();
    this.fileGeneratorService = new FileGeneratorService();
    this.s3Service = new S3Service(this.s3Repository);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getAwsService(): IAwsService {
    return this.awsService;
  }

  public getFileGeneratorService(): IFileGeneratorService {
    return this.fileGeneratorService;
  }

  public getS3Service(): IS3Service {
    return this.s3Service;
  }

  // Method to reset instance for testing purposes
  public static reset(): void {
    Container.instance = undefined as any;
  }
} 