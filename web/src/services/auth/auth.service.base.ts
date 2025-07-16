export interface BaseAuthService {
  authenticate(): Promise<void>;
}
