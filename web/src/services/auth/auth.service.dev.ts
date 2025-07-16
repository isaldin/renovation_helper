import { BaseAuthService } from '@app/services/auth/auth.service.base';
import { injectable } from 'tsyringe';

@injectable()
export class AuthServiceDev implements BaseAuthService {
  public authenticate(): Promise<void> {
    console.log('Development mode: Skipping authentication');
    return Promise.resolve(undefined);
  }
}
