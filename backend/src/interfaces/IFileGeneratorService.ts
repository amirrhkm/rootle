import { GSAPEODRequest, GSAPMonthlyRequest } from '../types';

export interface IFileGeneratorService {
  generateGSAPEODFile(request: GSAPEODRequest): {
    fileName: string;
    content: string;
    s3Path: string;
  };

  generateGSAPMonthlyFile(request: GSAPMonthlyRequest): {
    fileName: string;
    content: string;
    s3Path: string;
  };
} 