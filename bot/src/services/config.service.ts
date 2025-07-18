import { config } from 'dotenv';
import { injectable } from 'tsyringe';
import { Config } from '../entities/config.ts';

config();

@injectable()
export class ConfigService implements Config {
  private readonly config: Config;

  constructor() {
    this.config = {
      domain: process.env.TELEGRAM_BOT_DOMAIN!,
      botToken: process.env.TELEGRAM_BOT_TOKEN!,
    };
  }

  public get domain(): string {
    return this.config.domain;
  }

  public get botToken(): string {
    return this.config.botToken;
  }
}
