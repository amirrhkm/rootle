import { IFileGeneratorService } from '../interfaces';
import { GSAPEODRequest, GSAPMonthlyRequest } from '../types';

export class FileGeneratorService implements IFileGeneratorService {
  generateGSAPEODFile(request: GSAPEODRequest): {
    fileName: string;
    content: string;
    s3Path: string;
  } {
    const fileName = this.buildGSAPEODFileName(request);
    const content = this.buildGSAPEODContent(request);
    const s3Path = `${request.sftpUser}/Import/EODSales/${fileName}`;

    return { fileName, content, s3Path };
  }

  generateGSAPMonthlyFile(request: GSAPMonthlyRequest): {
    fileName: string;
    content: string;
    s3Path: string;
  } {
    const fileName = this.buildGSAPMonthlyFileName(request);
    const content = this.buildGSAPMonthlyContent(request);
    const s3Path = `${request.sftpUser}/Import/FuelMonthEndDips/${fileName}`;

    return { fileName, content, s3Path };
  }

  private buildGSAPEODFileName(request: GSAPEODRequest): string {
    const { serviceType, generationType, siteId, date, startDate, endDate } = request;
    
    switch (generationType) {
      case 'single':
        return `Generate_${serviceType}_${siteId}_${date}.txt`;
      case 'range':
        return `Generate_${serviceType}_${siteId}_${startDate}-${endDate}.txt`;
      case 'bulk':
        return `Generate_${serviceType}_BULK_${date}.txt`;
      default:
        throw new Error(`Unknown generation type: ${generationType}`);
    }
  }

  private buildGSAPEODContent(request: GSAPEODRequest): string {
    const { generationType, bulkSites } = request;
    
    if (generationType === 'bulk' && bulkSites && bulkSites.length > 0) {
      return bulkSites.join('\n');
    }
    
    // For single and range types, the file is typically empty or contains minimal trigger data
    return '';
  }

  private buildGSAPMonthlyFileName(request: GSAPMonthlyRequest): string {
    const { siteId, year, month } = request;
    const paddedMonth = month.padStart(2, '0');
    return `Generate_FuelMonthEndDips_${siteId}_${year}${paddedMonth}.txt`;
  }

  private buildGSAPMonthlyContent(request: GSAPMonthlyRequest): string {
    // Monthly trigger files are typically empty - they serve as triggers by filename only
    return '';
  }
} 