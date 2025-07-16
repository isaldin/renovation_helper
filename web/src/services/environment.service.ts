import { injectable } from 'tsyringe';
import { Environment } from '@app/services/environment.service.types';

@injectable()
export class EnvironmentService {
  public get currentEnvironment(): Environment {
    if (import.meta.env.MODE === 'telegram') {
      return 'telegram';
    }

    if (import.meta.env.MODE === 'prod') {
      return 'production';
    }

    return 'development';
  }
}
