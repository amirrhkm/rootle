import { IAwsRepository, IAwsService } from '../interfaces';
import { AwsRepository } from '../repositories';
import { AwsService } from '../services';

export class Container {
  private static instance: Container;
  private awsRepository: IAwsRepository;
  private awsService: IAwsService;

  private constructor() {
    this.awsRepository = new AwsRepository();
    this.awsService = new AwsService(this.awsRepository);
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

  public static reset(): void {
    Container.instance = undefined as any;
  }
} 