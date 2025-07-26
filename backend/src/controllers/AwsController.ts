import { Request, Response } from 'express';
import { IAwsService } from '../interfaces';
import { AWSCredentials } from '../types';

export class AwsController {
  constructor(private awsService: IAwsService) {}

  async validateCredentials(req: Request, res: Response): Promise<void> {
    try {
      const credentials: AWSCredentials = req.body;
      const result = await this.awsService.validateCredentials(credentials);

      if (result.isValid) {
        res.json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error: any) {
      console.error("Unexpected error in AWS controller:", error);
      res.status(500).json({
        isValid: false,
        error: "Internal server error",
        checkedAt: new Date().toISOString()
      });
    }
  }
} 