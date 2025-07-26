import { AWSCredentials, AWSValidationResponse } from '../types';
 
export interface IAwsRepository {
  validateCredentials(credentials: AWSCredentials): Promise<AWSValidationResponse>;
} 