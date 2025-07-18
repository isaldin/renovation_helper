import { registerContainer } from '@common';
import { ServiceNames } from '@common';
import { FirebaseStore } from '@common/repository/firebase/firebaseStore';
import { AdminFirebaseStore } from '@common/repository/firebase/adminFirebaseStore';
import { FirebaseServiceAccountJsonProvider } from '@common/services';
import { BotService } from './services/bot.service';
import { ReportService } from './services/report.service';
import { ConfigService } from './services/config.service';
import { BotFirebaseServiceAccountJsonProvider } from './services/botFirebaseServiceAccountJsonProvider';

export const setupContainer = (): void => {
  registerContainer((container) => {
    container.registerSingleton<FirebaseServiceAccountJsonProvider>(
      ServiceNames.FirebaseServiceAccountJsonProvider,
      BotFirebaseServiceAccountJsonProvider
    );
    container.registerSingleton<FirebaseStore>(ServiceNames.FirebaseStore, AdminFirebaseStore);

    container.registerSingleton<BotService>(ServiceNames.BotService, BotService);
    container.registerSingleton<ReportService>(ServiceNames.BotReportService, ReportService);
    container.registerSingleton<ConfigService>(ServiceNames.BotConfigService, ConfigService);
  });
};
