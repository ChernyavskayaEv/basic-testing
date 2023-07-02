// Uncomment the code below and write your tests
import {
  getBankAccount,
  BankAccount,
  TransferFailedError,
  SynchronizationFailedError,
  InsufficientFundsError,
} from '.';

describe('BankAccount', () => {
  const initialMoney = 145;
  let newBankAccount = getBankAccount(0);
  const otherBankAccount = getBankAccount(0);

  beforeEach(() => {
    return (newBankAccount = getBankAccount(initialMoney));
  });

  test('should create account with initial balance', () => {
    expect(newBankAccount).toEqual(new BankAccount(initialMoney));
    expect(newBankAccount).toHaveProperty('_balance');
    expect(newBankAccount).toEqual({ _balance: initialMoney });
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = newBankAccount.getBalance();
    const withdrawMoney = balance + 10;

    expect(() => newBankAccount.withdraw(withdrawMoney)).toThrow(
      new InsufficientFundsError(balance),
    );
  });

  test('should throw error when transferring more than balance', () => {
    const balance = newBankAccount.getBalance();
    const transferMoney = balance + 10;
    expect(() =>
      newBankAccount.transfer(transferMoney, otherBankAccount),
    ).toThrow(new InsufficientFundsError(balance));
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => newBankAccount.transfer(10, newBankAccount)).toThrow(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const balance = newBankAccount.getBalance();
    const depositMoney = 10;

    expect(newBankAccount.deposit(depositMoney)).toEqual({
      _balance: balance + depositMoney,
    });
  });

  test('should withdraw money', () => {
    const balance = newBankAccount.getBalance();
    const withdrawMoney = balance - 10;

    expect(newBankAccount.withdraw(withdrawMoney)).toEqual({
      _balance: 10,
    });
  });

  test('should transfer money', () => {
    const balance = newBankAccount.getBalance();

    expect(newBankAccount.transfer(100, otherBankAccount)).toEqual({
      _balance: balance - 100,
    });
    expect(otherBankAccount).toEqual({ _balance: 100 });
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    newBankAccount.fetchBalance = jest.fn(() => Promise.resolve(Math.random()));
    await expect(newBankAccount.fetchBalance()).resolves.toEqual(
      expect.any(Number),
    );
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const newBalance = Math.random();
    newBankAccount.fetchBalance = jest.fn(() => Promise.resolve(newBalance));

    await expect(
      newBankAccount
        .synchronizeBalance()
        .then(() => newBankAccount.getBalance()),
    ).resolves.toEqual(newBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    newBankAccount.fetchBalance = jest.fn(() => Promise.resolve(null));

    await expect(newBankAccount.synchronizeBalance()).rejects.toThrow(
      new SynchronizationFailedError(),
    );
  });
});
