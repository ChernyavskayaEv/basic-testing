// Uncomment the code below and write your tests
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');
  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const mockLog = jest.spyOn(global.console, 'log');

    mockOne();
    expect(mockOne).toHaveBeenCalled();
    expect(mockOne).not.toHaveBeenCalledWith('foo');

    mockTwo();
    expect(mockTwo).toHaveBeenCalled();
    expect(mockTwo).not.toHaveBeenCalledWith('bar');

    mockThree();
    expect(mockThree).toHaveBeenCalled();
    expect(mockThree).not.toHaveBeenCalledWith('baz');
    expect(mockLog).not.toHaveBeenCalled();
    mockLog.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    const mockLog = jest.spyOn(global.console, 'log');

    unmockedFunction();

    expect(mockLog).toHaveBeenCalled();
    expect(mockLog).toHaveBeenCalledWith('I am not mocked');
    mockLog.mockRestore();
  });
});
