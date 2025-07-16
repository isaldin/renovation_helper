import { AxiosError, AxiosResponse } from 'axios';

export interface AxiosResponseInterceptor<T extends AxiosResponse = AxiosResponse> {
  onFulfilled: ((value: T) => T | Promise<T>) | null;
  onRejected?: ((error: AxiosError) => any) | null;
}
