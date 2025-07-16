import type { WebApp } from 'telegram-webapps-types-new';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}
