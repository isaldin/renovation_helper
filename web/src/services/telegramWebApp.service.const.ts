const TELEGRAM_WEB_APP_VALUE_KEYS = ['calculatorId', 'companyId', 'userId'] as const;

export type TelegramWebAppValueKey = (typeof TELEGRAM_WEB_APP_VALUE_KEYS)[number];

export const telegramWebAppValues: Record<string, TelegramWebAppValueKey> = {
  calculatorId: 'calculatorId',
  companyId: 'companyId',
  userId: 'userId',
};
