import { Request, Response } from 'express';
import { HealthCheckResponse, InfoResponse } from '../types';

export class HealthController {
  health(req: Request, res: Response): void {
    const response: HealthCheckResponse = {
      status: "ok"
    };
    res.json(response);
  }

  info(req: Request, res: Response): void {
    const response: InfoResponse = {
      name: "Rootle API",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }
} 