import { Request, Response } from 'express';
import { IFileGeneratorService, IS3Service } from '../interfaces';
import { GSAPEODRequest, GSAPMonthlyRequest, AWSCredentials } from '../types';

interface AuthenticatedRequest extends Request {
  activeCredentials?: AWSCredentials;
}

export class CloudServiceController {
  constructor(
    private fileGeneratorService: IFileGeneratorService,
    private s3Service: IS3Service
  ) {}

  async generateGSAPEODFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const request: GSAPEODRequest = req.body;
      
      // Validate required fields
      if (!request.serviceType || !request.generationType || !request.sftpUser || !request.bucketName) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: serviceType, generationType, sftpUser, bucketName'
        });
        return;
      }

      // Validate generation type specific fields
      if (request.generationType === 'single' && (!request.siteId || !request.date)) {
        res.status(400).json({
          success: false,
          error: 'Single generation type requires siteId and date'
        });
        return;
      }

      if (request.generationType === 'range' && (!request.siteId || !request.startDate || !request.endDate)) {
        res.status(400).json({
          success: false,
          error: 'Range generation type requires siteId, startDate, and endDate'
        });
        return;
      }

      if (request.generationType === 'bulk' && (!request.bulkSites || request.bulkSites.length === 0 || !request.date)) {
        res.status(400).json({
          success: false,
          error: 'Bulk generation type requires bulkSites array and date'
        });
        return;
      }

      // Get AWS credentials (this would come from the active profile)
      const credentials = req.activeCredentials;
      if (!credentials) {
        res.status(401).json({
          success: false,
          error: 'No active AWS credentials. Please set an active AWS profile.'
        });
        return;
      }

      // Generate file
      const { fileName, content, s3Path } = this.fileGeneratorService.generateGSAPEODFile(request);
      
      // Upload to S3
      const importPath = `${request.sftpUser}/Import/EODSales`;
      const uploadResult = await this.s3Service.uploadTriggerFile(
        credentials,
        request.bucketName,
        fileName,
        content,
        importPath
      );

      res.json(uploadResult);
    } catch (error: any) {
      console.error('Error generating GSAP EOD file:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }

  async generateGSAPMonthlyFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const request: GSAPMonthlyRequest = req.body;
      
      // Validate required fields
      if (!request.siteId || !request.year || !request.month || !request.sftpUser || !request.bucketName) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: siteId, year, month, sftpUser, bucketName'
        });
        return;
      }

      // Get AWS credentials
      const credentials = req.activeCredentials;
      if (!credentials) {
        res.status(401).json({
          success: false,
          error: 'No active AWS credentials. Please set an active AWS profile.'
        });
        return;
      }

      // Generate file
      const { fileName, content, s3Path } = this.fileGeneratorService.generateGSAPMonthlyFile(request);
      
      // Upload to S3
      const importPath = `${request.sftpUser}/Import/FuelMonthEndDips`;
      const uploadResult = await this.s3Service.uploadTriggerFile(
        credentials,
        request.bucketName,
        fileName,
        content,
        importPath
      );

      res.json(uploadResult);
    } catch (error: any) {
      console.error('Error generating GSAP Monthly file:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }

  async monitorOutputFiles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { serviceType, bucketName, sftpUser, triggerFileName } = req.query;
      
      if (!serviceType || !bucketName || !sftpUser || !triggerFileName) {
        res.status(400).json({
          success: false,
          error: 'Missing required query parameters: serviceType, bucketName, sftpUser, triggerFileName'
        });
        return;
      }

      const credentials = req.activeCredentials;
      if (!credentials) {
        res.status(401).json({
          success: false,
          error: 'No active AWS credentials'
        });
        return;
      }

      // Determine export path based on service type
      let exportPath: string;
      if (serviceType === 'GSAP-EOD') {
        exportPath = `${sftpUser}/Export/EODSales`;
      } else if (serviceType === 'GSAP-Monthly') {
        exportPath = `${sftpUser}/Export/FuelMonthEndDips`;
      } else {
        res.status(400).json({
          success: false,
          error: 'Invalid service type. Must be GSAP-EOD or GSAP-Monthly'
        });
        return;
      }

      const outputMatch = await this.s3Service.monitorOutputFiles(
        credentials,
        bucketName as string,
        exportPath,
        triggerFileName as string,
        serviceType as string
      );

      res.json(outputMatch);
    } catch (error: any) {
      console.error('Error monitoring output files:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }

  async getFileContent(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { bucketName, filePath } = req.query;
      
      if (!bucketName || !filePath) {
        res.status(400).json({
          success: false,
          error: 'Missing required query parameters: bucketName, filePath'
        });
        return;
      }

      const credentials = req.activeCredentials;
      if (!credentials) {
        res.status(401).json({
          success: false,
          error: 'No active AWS credentials'
        });
        return;
      }

      const fileContent = await this.s3Service.getFileContent(
        credentials,
        bucketName as string,
        filePath as string
      );

      res.json(fileContent);
    } catch (error: any) {
      console.error('Error getting file content:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }

  async listOutputFiles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { bucketName, exportPath } = req.query;
      
      if (!bucketName || !exportPath) {
        res.status(400).json({
          success: false,
          error: 'Missing required query parameters: bucketName, exportPath'
        });
        return;
      }

      const credentials = req.activeCredentials;
      if (!credentials) {
        res.status(401).json({
          success: false,
          error: 'No active AWS credentials'
        });
        return;
      }

      const files = await this.s3Service.listOutputFiles(
        credentials,
        bucketName as string,
        exportPath as string
      );

      res.json({ files });
    } catch (error: any) {
      console.error('Error listing output files:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }
} 