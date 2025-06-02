import { FirebaseService } from '@/common/services';
import type { FirebaseServiceConfig } from '@/common/services';
import { ServiceNames } from '@/common/di';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AppInitService {
  constructor(
    @inject(ServiceNames.FirebaseService) protected readonly firebaseService: FirebaseService,
    @inject(ServiceNames.WAFirebaseConfigService) protected readonly config: FirebaseServiceConfig
  ) {}

  public async initializeApp(): Promise<void> {
    this.firebaseService.initializeFirebase(this.config);
  }
}
