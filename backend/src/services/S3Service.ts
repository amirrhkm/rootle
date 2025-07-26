import { IS3Service, IS3Repository } from '../interfaces';
import { AWSCredentials, FileUploadResponse, S3FileInfo, OutputFileMatch, FileContentResponse } from '../types';

export class S3Service implements IS3Service {
  constructor(private s3Repository: IS3Repository) {}

  async uploadTriggerFile(
    credentials: AWSCredentials,
    bucketName: string,
    fileName: string,
    content: string,
    importPath: string
  ): Promise<FileUploadResponse> {
    try {
      const s3Key = `${importPath}/${fileName}`;
      
      await this.s3Repository.uploadFile(
        credentials,
        bucketName,
        s3Key,
        content,
        'text/plain'
      );

      return {
        success: true,
        fileName,
        s3Path: `s3://${bucketName}/${s3Key}`,
        uploadedAt: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        success: false,
        fileName,
        s3Path: `s3://${bucketName}/${importPath}/${fileName}`,
        uploadedAt: new Date().toISOString(),
        error: error.message || 'Upload failed'
      };
    }
  }

  async monitorOutputFiles(
    credentials: AWSCredentials,
    bucketName: string,
    exportPath: string,
    triggerFileName: string,
    serviceType: string
  ): Promise<OutputFileMatch> {
    const outputFiles = await this.s3Repository.listFiles(
      credentials,
      bucketName,
      exportPath
    );

    // Filter files based on service type and potential patterns
    const matchingFiles = this.findMatchingOutputFiles(
      outputFiles,
      triggerFileName,
      serviceType
    );

    return {
      triggerFileName,
      outputFiles: matchingFiles,
      serviceType,
      generatedAt: matchingFiles.length > 0 ? 
        matchingFiles.reduce((latest, file) => 
          file.lastModified > latest ? file.lastModified : latest, 
          matchingFiles[0].lastModified
        ) : undefined
    };
  }

  async getFileContent(
    credentials: AWSCredentials,
    bucketName: string,
    filePath: string
  ): Promise<FileContentResponse> {
    return await this.s3Repository.downloadFile(credentials, bucketName, filePath);
  }

  async listOutputFiles(
    credentials: AWSCredentials,
    bucketName: string,
    exportPath: string
  ): Promise<S3FileInfo[]> {
    return await this.s3Repository.listFiles(credentials, bucketName, exportPath);
  }

  private findMatchingOutputFiles(
    outputFiles: S3FileInfo[],
    triggerFileName: string,
    serviceType: string
  ): S3FileInfo[] {
    // Extract relevant information from trigger file name
    const triggerInfo = this.parseTriggerFileName(triggerFileName, serviceType);
    
    if (!triggerInfo) {
      return [];
    }
    
    return outputFiles.filter(file => {
      const fileName = file.key.split('/').pop() || '';
      return this.isMatchingOutputFile(fileName, triggerInfo, serviceType);
    });
  }

  private parseTriggerFileName(triggerFileName: string, serviceType: string): any {
    // Remove the "Generate_" prefix and ".txt" suffix
    const baseName = triggerFileName.replace(/^Generate_/, '').replace(/\.txt$/, '');
    
    if (serviceType === 'GSAP-EOD') {
      // Parse EODSales/POSSales patterns
      // Examples:
      // - EODSales_0084_20250726 (single)
      // - EODSales_0084_20250121-20250123 (range)  
      // - EODSales_BULK_20250121 (bulk)
      const parts = baseName.split('_');
      
      if (parts.length < 3) {
        return null;
      }
      
      const type = parts[0]; // EODSales or POSSales
      
      if (parts[1] === 'BULK') {
        return { 
          type, 
          pattern: 'bulk', 
          date: parts[2],
          siteId: null 
        };
      } else {
        const siteId = parts[1];
        const dateOrRange = parts[2];
        
        // Check if it's a date range (contains hyphen)
        if (dateOrRange.includes('-')) {
          const [startDate, endDate] = dateOrRange.split('-');
          return { 
            type, 
            siteId, 
            startDate, 
            endDate, 
            pattern: 'range' 
          };
        } else {
          return { 
            type, 
            siteId, 
            date: dateOrRange, 
            pattern: 'single' 
          };
        }
      }
    } else if (serviceType === 'GSAP-Monthly') {
      // Parse FuelMonthEndDips patterns
      // Example: FuelMonthEndDips_0084_202504
      const parts = baseName.split('_');
      if (parts.length < 3) {
        return null;
      }
      
      return {
        type: 'FuelMonthEndDips',
        siteId: parts[1],
        yearMonth: parts[2]
      };
    }
    
    return null;
  }

  private isMatchingOutputFile(fileName: string, triggerInfo: any, serviceType: string): boolean {
    if (!triggerInfo) {
      return false;
    }
    
    if (serviceType === 'GSAP-EOD') {
      // Output pattern: EODSales_0084_20250726T164857_20250726.txt
      // Pattern: {Type}_{SiteID}_{GeneratedTimestamp}_{BusinessDate}.txt
      
      if (triggerInfo.pattern === 'bulk') {
        // For bulk operations, we can't match specific site IDs
        // Just match the type and date
        const bulkPattern = new RegExp(`^${triggerInfo.type}_\\d+_\\d{8}T\\d{6}_${triggerInfo.date}\\.txt$`);
        return bulkPattern.test(fileName);
      } else {
        // For single and range operations, match site ID and date(s)
        const basePattern = `^${triggerInfo.type}_${triggerInfo.siteId}_\\d{8}T\\d{6}_`;
        
        if (triggerInfo.pattern === 'single') {
          // Match exact date
          const singlePattern = new RegExp(`${basePattern}${triggerInfo.date}\\.txt$`);
          return singlePattern.test(fileName);
        } else if (triggerInfo.pattern === 'range') {
          // For range, the output could contain any date within the range
          // For now, we'll check if the filename contains the start or end date
          const rangePattern = new RegExp(`${basePattern}(${triggerInfo.startDate}|${triggerInfo.endDate})\\.txt$`);
          return rangePattern.test(fileName);
        }
      }
    } else if (serviceType === 'GSAP-Monthly') {
      // Output pattern: FuelMonthEndDips_10000000_20250725.xml
      // We need to match based on the year/month from the trigger
      const year = triggerInfo.yearMonth.substring(0, 4);
      const month = triggerInfo.yearMonth.substring(4, 6);
      
      // The output file should contain a date from the same year/month
      const monthlyPattern = new RegExp(`^FuelMonthEndDips_\\d+_${year}${month}\\d{2}\\.xml$`);
      return monthlyPattern.test(fileName);
    }
    
    return false;
  }
} 