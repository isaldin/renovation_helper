import { registerContainer, ServiceNames } from '@common';
import { DependencyContainer } from 'tsyringe';
import { BackendFirebaseServiceAccountJsonProvider } from '../firebase/services/backendFirebaseServiceAccountJsonProvider';
import { FirebaseServiceAccountJsonProvider } from '@common/services';
import { FirebaseStore } from '@common/repository/firebase/firebaseStore';
import { AdminFirebaseStore } from '@common/repository/firebase/adminFirebaseStore';
import { ConfigService } from '../services/config.service';
import { JwtService } from '../services/jwt.service';
import { CalculationResultsController } from '../controllers/calculationResults.controller';
import { MeController } from '../controllers/me.controller';
import { getAuthControllerClass } from '../controllers/auth';
import { BaseAuthController } from '../controllers/auth/auth.controller.base';
import { ReportController } from '../controllers/report/report.controller';
import { CompanyService } from '@common';
import { CompanyRepository } from '@common/repository/company/company.repository';
import { PdfQueueService } from '../services/pdf-queue.service';

export const initContainer = async () => {
  const AuthController = await getAuthControllerClass();

  registerContainer((container: DependencyContainer) => {
    container.registerSingleton<ConfigService>(ServiceNames.BAConfigService, ConfigService);

    container.registerSingleton<JwtService>(ServiceNames.BAJwtService, JwtService);

    container.registerSingleton<FirebaseServiceAccountJsonProvider>(
      ServiceNames.FirebaseServiceAccountJsonProvider,
      BackendFirebaseServiceAccountJsonProvider
    );
    container.registerSingleton<FirebaseStore>(ServiceNames.FirebaseStore, AdminFirebaseStore);

    container.registerSingleton<CompanyRepository>(ServiceNames.CompanyRepository, CompanyRepository);
    container.registerSingleton<CompanyService>(ServiceNames.CompanyService, CompanyService);

    container.registerSingleton<BaseAuthController>(ServiceNames.BAAuthController, AuthController);

    container.registerSingleton<MeController>(ServiceNames.BAMeController, MeController);
    container.registerSingleton<CalculationResultsController>(
      ServiceNames.BACalculationResultsController,
      CalculationResultsController
    );
    container.registerSingleton<ReportController>(ServiceNames.BAReportController, ReportController);

    container.registerSingleton<PdfQueueService>(ServiceNames.BAPdfQueueService, PdfQueueService);
  });
};
