import { Router } from 'express';
import { HealthController } from '../controllers';

export function createHealthRoutes(): Router {
  const router = Router();
  const healthController = new HealthController();

  router.get('/health', healthController.health.bind(healthController));
  router.get('/info', healthController.info.bind(healthController));

  return router;
} 