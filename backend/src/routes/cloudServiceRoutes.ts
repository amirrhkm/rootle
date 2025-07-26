import { Router } from 'express';
import { CloudServiceController } from '../controllers';
import { IFileGeneratorService, IS3Service } from '../interfaces';
import { injectActiveCredentials } from '../middleware/authMiddleware';

export function createCloudServiceRoutes(
  fileGeneratorService: IFileGeneratorService,
  s3Service: IS3Service
): Router {
  const router = Router();
  const cloudServiceController = new CloudServiceController(fileGeneratorService, s3Service);

  // Apply middleware to inject AWS credentials
  router.use(injectActiveCredentials);

  // File generation endpoints
  router.post('/gsap-eod/generate', 
    cloudServiceController.generateGSAPEODFile.bind(cloudServiceController)
  );
  
  router.post('/gsap-monthly/generate', 
    cloudServiceController.generateGSAPMonthlyFile.bind(cloudServiceController)
  );

  // Output monitoring endpoints
  router.get('/outputs/monitor', 
    cloudServiceController.monitorOutputFiles.bind(cloudServiceController)
  );
  
  router.get('/outputs/content', 
    cloudServiceController.getFileContent.bind(cloudServiceController)
  );
  
  router.get('/outputs/list', 
    cloudServiceController.listOutputFiles.bind(cloudServiceController)
  );

  return router;
} 