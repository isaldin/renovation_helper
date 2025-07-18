import { ru } from './ru';

export type TranslationKey = keyof typeof ru;

export const translations = {
  ru
};

export const defaultLanguage = 'ru';

export const t = (key: string, params?: Record<string, string | number>): string => {
  const lang = defaultLanguage;
  const translation = getNestedTranslation(translations[lang], key);
  
  if (!translation) {
    console.warn(`Translation not found for key: ${key}`);
    return key;
  }
  
  if (params) {
    return replacePlaceholders(translation, params);
  }
  
  return translation;
};

const getNestedTranslation = (obj: any, key: string): string | null => {
  const keys = key.split('.');
  let current = obj;
  
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return null;
    }
  }
  
  return typeof current === 'string' ? current : null;
};

const replacePlaceholders = (text: string, params: Record<string, string | number>): string => {
  return Object.keys(params).reduce((result, key) => {
    return result.replace(new RegExp(`{${key}}`, 'g'), String(params[key]));
  }, text);
};