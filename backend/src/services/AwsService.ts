import { IAwsService, IAwsRepository } from '../interfaces';
import { AWSCredentials, AWSValidationResponse } from '../types';

export class AwsService implements IAwsService {
  constructor(private awsRepository: IAwsRepository) {}

  async validateCredentials(credentials: AWSCredentials): Promise<AWSValidationResponse> {
    const { accessKeyId, secretAccessKey, region } = credentials;

    if (!accessKeyId || !secretAccessKey || !region) {
      return {
        isValid: false,
        error: "Missing required credentials (accessKeyId, secretAccessKey, region)",
        checkedAt: new Date().toISOString()
      };
    }

    return await this.awsRepository.validateCredentials(credentials);
  }
} 