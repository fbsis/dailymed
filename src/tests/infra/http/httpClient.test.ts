import { AxiosHttpClient, RequestConfig } from '@/infra/http/httpClient';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosHttpClient', () => {
  let httpClient: AxiosHttpClient;
  const baseURL = 'https://api.example.com';
  let mockAxiosInstance: jest.Mocked<ReturnType<typeof axios.create>>;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<ReturnType<typeof axios.create>>;

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    httpClient = new AxiosHttpClient(baseURL);
  });

  it('should create axios instance with baseURL', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL });
  });

  it('should make a GET request with correct parameters', async () => {
    const url = '/test';
    const headers = { 'Content-Type': 'application/json' };
    const responseData = { success: true };
    mockAxiosInstance.get.mockResolvedValue({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    });

    const result = await httpClient.get(url, { headers });
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(url, { headers });
    expect(result).toEqual(responseData);
  });

  it('should make a POST request with correct parameters', async () => {
    const url = '/test';
    const data = { name: 'test' };
    const headers = { 'Content-Type': 'application/json' };
    const responseData = { success: true };
    mockAxiosInstance.post.mockResolvedValue({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    });

    const result = await httpClient.post(url, data, { headers });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(url, data, { headers });
    expect(result).toEqual(responseData);
  });

  it('should make a PUT request with correct parameters', async () => {
    const url = '/test';
    const data = { name: 'test' };
    const headers = { 'Content-Type': 'application/json' };
    const responseData = { success: true };
    mockAxiosInstance.put.mockResolvedValue({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    });

    const result = await httpClient.put(url, data, { headers });
    expect(mockAxiosInstance.put).toHaveBeenCalledWith(url, data, { headers });
    expect(result).toEqual(responseData);
  });

  it('should make a DELETE request with correct parameters', async () => {
    const url = '/test';
    const headers = { 'Content-Type': 'application/json' };
    const responseData = { success: true };
    mockAxiosInstance.delete.mockResolvedValue({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url }
    });

    const result = await httpClient.delete(url, { headers });
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith(url, { headers });
    expect(result).toEqual(responseData);
  });

  it('should handle errors correctly', async () => {
    const url = '/test';
    const headers = { 'Content-Type': 'application/json' };
    const error = new Error('Network error');
    mockAxiosInstance.get.mockRejectedValue(error);

    await expect(httpClient.get(url, { headers })).rejects.toThrow('Network error');
  });
}); 