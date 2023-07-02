// Uncomment the code below and write your tests
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();

    doStuffByTimeout(callback, 1000);

    expect(mockSetTimeout).toHaveBeenCalledTimes(1);
    expect(mockSetTimeout).toHaveBeenLastCalledWith(callback, 1000);
    mockSetTimeout.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);

    expect(callback).not.toBeCalled();

    jest.runAllTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockSetInterval = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, 1000);

    expect(mockSetInterval).toHaveBeenCalledTimes(1);
    expect(mockSetInterval).toHaveBeenLastCalledWith(callback, 1000);
    mockSetInterval.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(3000);

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'somePath';
    const mockJoin = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);
    expect(mockJoin).toHaveBeenCalledWith(__dirname, pathToFile);
    mockJoin.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'somePath';
    const mockExists = jest.spyOn(fs, 'existsSync');

    mockExists.mockReturnValue(false);
    await expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
    mockExists.mockRestore();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'somePath';
    const content = 'someContent';
    const mockExists = jest.spyOn(fs, 'existsSync');
    const mockReadFile = jest.spyOn(fsPromises, 'readFile');

    mockExists.mockReturnValue(true);
    mockReadFile.mockResolvedValue(content);

    await expect(readFileAsynchronously(pathToFile)).resolves.toBe(content);
    mockExists.mockRestore();
    mockReadFile.mockRestore();
  });
});
