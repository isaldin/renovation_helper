export interface BackendConfig {
  isDev: boolean;

  host: string;
  port: number;
  useHttps: boolean;

  botToken: string;
  jwtSecret: string;
  authCookieDomain: string;
}
