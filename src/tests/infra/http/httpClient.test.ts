import { AxiosHttpClient, RequestConfig } from '@/infra/http/httpClient';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosHttpClient', () => {
  let httpClient: AxiosHttpClient;
  const baseURL = 'https://api.example.com';

  beforeEach(() => {
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    httpClient = new AxiosHttpClient(baseURL);
  });

  it('should create axios instance with baseURL', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL });
  });

}); 