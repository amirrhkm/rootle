import { Request, Response, NextFunction } from 'express';
import { AWSCredentials } from '../types';

interface AuthenticatedRequest extends Request {
  activeCredentials?: AWSCredentials;
}

// For now, this is a simple middleware that could be enhanced later
// to fetch active credentials from a session or database
export function injectActiveCredentials(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // This is a placeholder - in a real app, you would:
  // 1. Get user session/token
  // 2. Fetch their active AWS profile from database
  // 3. Inject those credentials into req.activeCredentials
  
  // For development, we'll expect credentials to be passed in headers
  const accessKeyId = req.headers['x-aws-access-key-id'] as string;
  const secretAccessKey = req.headers['x-aws-secret-access-key'] as string;
  const region = req.headers['x-aws-region'] as string;
  const sessionToken = req.headers['x-aws-session-token'] as string;

  if (accessKeyId && secretAccessKey && region) {
    req.activeCredentials = {
      accessKeyId,
      secretAccessKey,
      region,
      ...(sessionToken && { sessionToken })
    };
  }

  next();
} 