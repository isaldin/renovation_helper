import { BaseAuthService } from '@app/services/auth/auth.service.base';

export const getAuthServiceClass = async (): Promise<new (...args: unknown[]) => BaseAuthService> => {
  // if (import.meta.env.MODE === 'development') {
  //   const result = await import('./auth.service.dev');
  //   return result.AuthServiceDev as new (...args: unknown[]) => BaseAuthService;
  // }

  const result = await import('./auth.service');
  return result.AuthService as new (...args: unknown[]) => BaseAuthService;
};
