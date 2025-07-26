import { Router } from 'express';
import { AwsController } from '../controllers';
import { IAwsService } from '../interfaces';

export function createAwsRoutes(awsService: IAwsService): Router {
  const router = Router();
  const awsController = new AwsController(awsService);

  router.post('/validate-credentials', awsController.validateCredentials.bind(awsController));

  return router;
} 