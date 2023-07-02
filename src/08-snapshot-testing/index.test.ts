// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const result = generateLinkedList([1, 2]);
    const linkedList = {
      next: {
        next: {
          next: null,
          value: null,
        },
        value: 2,
      },
      value: 1,
    };

    expect(result).toStrictEqual(linkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const result = generateLinkedList(['value1', 'value2', 'value3']);

    expect(result).toMatchSnapshot();
  });
});
