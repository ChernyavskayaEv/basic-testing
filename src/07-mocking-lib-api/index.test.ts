// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const mockCreate = jest.spyOn(axios, 'create');
    const mockGet = jest.spyOn(axios.Axios.prototype, 'get');
    const path = '/somePath';
    mockGet.mockResolvedValue({
      data: null,
    });

    await throttledGetDataFromApi(path);
    jest.runAllTimers();

    const baseUrl = mockCreate.mock.calls[0]?.[0]?.baseURL;
    const instance = mockCreate.mock.results[0]?.value.defaults;
    expect(instance.baseURL).toBe(baseUrl);

    mockCreate.mockRestore();
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.spyOn(axios.Axios.prototype, 'get');
    const path = '/somePath';
    mockGet.mockResolvedValue({
      data: null,
    });

    await throttledGetDataFromApi(path);
    jest.runAllTimers();

    const providedUrl = mockGet.mock.calls[0]?.[0];
    expect(providedUrl).toBe(path);

    mockGet.mockRestore();
  });

  test('should return response data', async () => {
    const mockGet = jest.spyOn(axios.Axios.prototype, 'get');
    const responseData = {
      data: [{ title: 'return response data' }],
    };

    mockGet.mockResolvedValue(responseData);

    const result = await throttledGetDataFromApi('/somePath');
    jest.runAllTimers();

    expect(result).toBe(responseData.data);
  });
});
