import { PdfService } from './services/pdf.service';
import { TelegramService } from './services/telegram.service';
import { GracefulShutdownService } from './services/graceful-shutdown.service';
import { LoggerService } from './services/logger.service';
import { FirebaseServiceAccountJsonProvider, registerContainer, ServiceNames } from '@common';
import { PdfWorkerService } from './services/pdf-worker.service';
import { FirebaseStore } from '@common/repository/firebase/firebaseStore';
import { AdminFirebaseStore } from '@common/repository/firebase/adminFirebaseStore';
import { PdfWorkerFirebaseServiceAccountJsonProvider } from './pdfWorkerFirebaseServiceAccountJsonProvider';

export function setupContainer(): void {
  registerContainer((container) => {
    container.registerSingleton<FirebaseServiceAccountJsonProvider>(
      ServiceNames.FirebaseServiceAccountJsonProvider,
      PdfWorkerFirebaseServiceAccountJsonProvider
    );
    container.registerSingleton<FirebaseStore>(ServiceNames.FirebaseStore, AdminFirebaseStore);

    container.registerSingleton(ServiceNames.PWPdfService, PdfService);
    container.registerSingleton(ServiceNames.PWTelegramService, TelegramService);
    container.registerSingleton(ServiceNames.PWPdfWorkerService, PdfWorkerService);
    container.registerSingleton(ServiceNames.PWGracefulShutdownService, GracefulShutdownService);
    container.registerSingleton(ServiceNames.PWLoggerService, LoggerService);
  });
}
