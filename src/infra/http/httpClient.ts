import axios from 'axios';

export interface RequestConfig {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

export class AxiosHttpClient implements HttpClient {
  private readonly client;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL });
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data as T;
  }

  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data as T;
  }

  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data as T;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data as T;
  }
} 