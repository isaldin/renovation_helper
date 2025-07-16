import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { injectable, inject } from 'tsyringe';
import { ServiceNames } from '@/common';
import { UnauthInterceptor } from '@app/services/interceptors/unauth.interceptor';

@injectable()
export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor(
    @inject('BACKEND_BASE_URL') baseURL: string,
    @inject(ServiceNames.WAUnauthInterceptor) private readonly unauthInterceptor: UnauthInterceptor
  ) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    [this.unauthInterceptor].forEach((interceptor) => {
      this.axiosInstance.interceptors.response.use(
        interceptor.onFulfilled.bind(interceptor),
        interceptor.onRejected.bind(interceptor)
      );
    });
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  async post<T = unknown, I = Record<string, unknown>>(url: string, data?: I, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  async put<T = unknown, I = Record<string, unknown>>(url: string, data?: I, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}
