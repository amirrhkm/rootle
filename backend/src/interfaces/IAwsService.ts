import { AWSCredentials, AWSValidationResponse } from '../types';

export interface IAwsService {
  validateCredentials(credentials: AWSCredentials): Promise<AWSValidationResponse>;
} 