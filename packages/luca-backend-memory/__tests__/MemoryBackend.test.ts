import { Decimal } from 'decimal.js';
import { MemoryBackend } from '../src';
import {
  Account,
  Entry,
  mockCreditAccountData,
  mockDebitAccountData,
  Transaction,
} from '@germanamz/luca-common';

describe('MemoryBackend', () => {
  describe('createAccount', () => {
    it('should create a new account', () => {
      const backend = new MemoryBackend();
      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = backend.createAccount(accountData);

      expect(typeof accountId).toBe('string');
      expect(backend.accounts.size).toBe(1);
      expect(backend.accounts.get(accountId)).toEqual({
        id: accountId,
        ...accountData,
      });
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', () => {
      const backend = new MemoryBackend();
      const transactionData: Omit<Transaction, 'id'> = {
        amount: new Decimal(0),
        date: new Date(),
        sourceAccountId: 'sourceAccountId',
        destinationAccountId: 'destinationAccountId',
      };
      const transactionId = backend.createTransaction(transactionData);

      expect(typeof transactionId).toBe('string');
      expect(backend.transactions.size).toBe(1);
      expect(backend.transactions.get(transactionId)).toEqual({
        id: transactionId,
        ...transactionData,
      });
    });
  });

  describe('createEntry', () => {
    it('should create a new entry', () => {
      const backend = new MemoryBackend();
      const transactionData: Omit<Entry, 'id'> = {
        accountId: 'accountId',
        transactionId: 'transactionId',
        side: 'DEBIT',
        amount: new Decimal(0),
        date: new Date(),
      };
      const entryId = backend.createEntry(transactionData);

      expect(typeof entryId).toBe('string');
      expect(backend.entries.size).toBe(1);
      expect(backend.entries.get(entryId)).toEqual({
        id: entryId,
        ...transactionData,
      });
    });
  });

  describe('getAccount', () => {
    it('should get an account', () => {
      const backend = new MemoryBackend();
      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = backend.createAccount(accountData);
      const account = backend.getAccount(accountId);

      expect(account).toEqual({
        id: accountId,
        ...accountData,
      });
    });

    it('should throw an error if the account does not exist', () => {
      const backend = new MemoryBackend();

      expect(() => backend.getAccount('non-existent-account-id')).toThrow(
        'Account non-existent-account-id not found',
      );
    });
  });

  describe('updateAccount', () => {
    it('should update an account', () => {
      const backend = new MemoryBackend();
      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = backend.createAccount(accountData);
      const originalAccount = backend.getAccount(accountId);

      backend.updateAccount(accountId, {
        debits: new Decimal(10),
      });

      const account = backend.getAccount(accountId);

      expect(account).toEqual({
        ...originalAccount,
        debits: new Decimal(10),
      });
    });

    it('should throw an error if the account does not exist', () => {
      const backend = new MemoryBackend();

      expect(() =>
        backend.updateAccount('non-existent-account-id', {
          debits: new Decimal(10),
        }),
      ).toThrow('Account non-existent-account-id not found');
    });
  });

  describe('getTransaction', () => {
    it('should get a transaction', () => {
      const backend = new MemoryBackend();
      const transactionData: Omit<Transaction, 'id'> = {
        amount: new Decimal(0),
        date: new Date(),
        sourceAccountId: 'sourceAccountId',
        destinationAccountId: 'destinationAccountId',
      };
      const transactionId = backend.createTransaction(transactionData);
      const transaction = backend.getTransaction(transactionId);

      expect(transaction).toEqual({
        id: transactionId,
        ...transactionData,
      });
    });

    it('should throw an error if the transaction does not exist', () => {
      const backend = new MemoryBackend();

      expect(() =>
        backend.getTransaction('non-existent-transaction-id'),
      ).toThrow('Transaction non-existent-transaction-id not found');
    });
  });

  describe('getEntry', () => {
    it('should get an entry', () => {
      const backend = new MemoryBackend();
      const entryData: Omit<Entry, 'id'> = {
        accountId: 'accountId',
        transactionId: 'transactionId',
        side: 'DEBIT',
        amount: new Decimal(0),
        date: new Date(),
      };
      const entryId = backend.createEntry(entryData);
      const entry = backend.getEntry(entryId);

      expect(entry).toEqual({
        id: entryId,
        ...entryData,
      });
    });

    it('should throw an error if the entry does not exist', () => {
      const backend = new MemoryBackend();

      expect(() => backend.getEntry('non-existent-entry-id')).toThrow(
        'Entry non-existent-entry-id not found',
      );
    });
  });

  describe('getAccountChildren', () => {
    it('should get the children of an account', () => {
      const backend = new MemoryBackend();
      const profitAccountData = mockCreditAccountData();
      const profitAccountId = backend.createAccount(profitAccountData);
      const expensesAccountData = mockDebitAccountData({
        parentId: profitAccountId,
      });
      const expensesAccountId = backend.createAccount(expensesAccountData);
      const revenueAccountData = mockCreditAccountData({
        parentId: profitAccountId,
      });
      const revenueAccountId = backend.createAccount(revenueAccountData);
      const children = backend.getAccountChildren(profitAccountId);

      expect(children).toEqual([
        { ...expensesAccountData, id: expensesAccountId },
        { ...revenueAccountData, id: revenueAccountId },
      ]);
    });
  });
});
