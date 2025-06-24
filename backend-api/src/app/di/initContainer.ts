import { registerContainer, ServiceNames } from '@common';
import { DependencyContainer } from 'tsyringe';
import { BackendFirebaseServiceAccountJsonProvider } from '../firebase/services/backendFirebaseServiceAccountJsonProvider';
import { FirebaseServiceAccountJsonProvider } from '@common/services';
import { FirebaseStore } from '@common/repository/firebase/firebaseStore';
import { AdminFirebaseStore } from '@common/repository/firebase/adminFirebaseStore';
import { DomainCalculatorMapRepository } from '../firebase/repositories/domainCalculatorMap.repository';
import { DomainCalculatorMapService } from '../firebase/services/domainCalculatorMap.service';
import { AuthController } from '../controllers/auth.controller';
import { ConfigService } from '../services/config.service';
import { JwtService } from '../services/jwt.service';
import { MeController } from '../controllers/me.controller';

export const initContainer = () => {
  registerContainer((container: DependencyContainer) => {
    container.registerSingleton<ConfigService>(ServiceNames.BAConfigService, ConfigService);

    container.registerSingleton<JwtService>(ServiceNames.BAJwtService, JwtService);

    container.registerSingleton<FirebaseServiceAccountJsonProvider>(
      ServiceNames.FirebaseServiceAccountJsonProvider,
      BackendFirebaseServiceAccountJsonProvider
    );
    container.registerSingleton<FirebaseStore>(ServiceNames.FirebaseStore, AdminFirebaseStore);

    container.registerSingleton<DomainCalculatorMapRepository>(
      ServiceNames.BADomainCalculatorMapRepository,
      DomainCalculatorMapRepository
    );
    container.registerSingleton<DomainCalculatorMapService>(
      ServiceNames.BADomainCalculatorMapService,
      DomainCalculatorMapService
    );

    container.registerSingleton<AuthController>(ServiceNames.BAAuthController, AuthController);
    container.registerSingleton<MeController>(ServiceNames.BAMeController, MeController);
  });
};
