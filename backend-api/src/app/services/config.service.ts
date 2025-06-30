import { injectable } from 'tsyringe';
import { BackendConfig } from './config.service.types.ts';

@injectable()
export class ConfigService implements BackendConfig {
  private readonly config: BackendConfig;

  constructor() {
    this.config = {
      isDev: process.env.NODE_ENV !== 'production',
      isTelegramMode: process.env.TELEGRAM_MODE === 'true' && process.env.NODE_ENV !== 'production',

      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT || '3000', 10),
      useHttps: process.env.BACKEND_HTTPS === 'true',
      botToken: process.env.TELEGRAM_BOT_TOKEN || '',
      jwtSecret: process.env.JWT_SECRET || '',
      authCookieDomain: process.env.AUTH_COOKIE_DOMAIN || '',
    };
  }

  public get isDev(): boolean {
    return this.config.isDev;
  }

  public get host(): string {
    return this.config.host;
  }

  public get port(): number {
    return this.config.port;
  }

  public get useHttps(): boolean {
    return this.config.useHttps;
  }

  public get botToken(): string {
    return this.config.botToken;
  }

  public get jwtSecret(): string {
    return this.config.jwtSecret;
  }

  public get authCookieDomain(): string {
    return this.config.authCookieDomain;
  }

  public get isTelegramMode(): boolean {
    return this.config.isTelegramMode;
  }
}
