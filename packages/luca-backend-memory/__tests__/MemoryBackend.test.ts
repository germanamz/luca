import { Decimal } from 'decimal.js';
import { MemoryBackend } from '../src';
import { Account, Entry, Transaction } from '@germanamz/luca-common';

describe('MemoryBackend', () => {
  describe('createAccount', () => {
    it('should create a new account', async () => {
      const backend = new MemoryBackend();
      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        name: 'Cash',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = await backend.createAccount(accountData);

      expect(typeof accountId).toBe('string');
      expect(backend.accounts.size).toBe(1);
      expect(backend.accounts.get(accountId)).toEqual({
        id: accountId,
        ...accountData,
      });
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const backend = new MemoryBackend();
      const transactionData: Omit<Transaction, 'id'> = {
        concept: 'Test Transaction',
        amount: new Decimal(0),
        date: new Date(),
        sourceAccountId: 'sourceAccountId',
        destinationAccountId: 'destinationAccountId',
      };
      const transactionId = await backend.createTransaction(transactionData);

      expect(typeof transactionId).toBe('string');
      expect(backend.transactions.size).toBe(1);
      expect(backend.transactions.get(transactionId)).toEqual({
        id: transactionId,
        ...transactionData,
      });
    });
  });

  describe('createEntry', () => {
    it('should create a new entry', async () => {
      const backend = new MemoryBackend();
      const transactionData: Omit<Entry, 'id'> = {
        accountId: 'accountId',
        transactionId: 'transactionId',
        side: 'DEBIT',
        amount: new Decimal(0),
        date: new Date(),
      };
      const entryId = await backend.createEntry(transactionData);

      expect(typeof entryId).toBe('string');
      expect(backend.entries.size).toBe(1);
      expect(backend.entries.get(entryId)).toEqual({
        id: entryId,
        ...transactionData,
      });
    });
  });

  describe('getAccount', () => {
    it('should get an account', async () => {
      const backend = new MemoryBackend();
      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        name: 'Cash',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = await backend.createAccount(accountData);
      const account = await backend.getAccount(accountId);

      expect(account).toEqual({
        id: accountId,
        ...accountData,
      });
    });

    it('should throw an error if the account does not exist', async () => {
      const backend = new MemoryBackend();

      await expect(
        backend.getAccount('non-existent-account-id'),
      ).rejects.toThrow('Account non-existent-account-id not found');
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const backend = new MemoryBackend();
      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        name: 'Cash',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = await backend.createAccount(accountData);
      const originalAccount = await backend.getAccount(accountId);

      await backend.updateAccount(accountId, {
        name: 'Updated Cash',
      });

      const account = await backend.getAccount(accountId);

      expect(account).toEqual({
        ...originalAccount,
        name: 'Updated Cash',
      });
    });

    it('should throw an error if the account does not exist', async () => {
      const backend = new MemoryBackend();

      await expect(
        backend.updateAccount('non-existent-account-id', {
          name: 'Updated Cash',
        }),
      ).rejects.toThrow('Account non-existent-account-id not found');
    });
  });

  describe('getTransaction', () => {
    it('should get a transaction', async () => {
      const backend = new MemoryBackend();
      const transactionData: Omit<Transaction, 'id'> = {
        concept: 'Test Transaction',
        amount: new Decimal(0),
        date: new Date(),
        sourceAccountId: 'sourceAccountId',
        destinationAccountId: 'destinationAccountId',
      };
      const transactionId = await backend.createTransaction(transactionData);
      const transaction = await backend.getTransaction(transactionId);

      expect(transaction).toEqual({
        id: transactionId,
        ...transactionData,
      });
    });

    it('should throw an error if the transaction does not exist', async () => {
      const backend = new MemoryBackend();

      await expect(
        backend.getTransaction('non-existent-transaction-id'),
      ).rejects.toThrow('Transaction non-existent-transaction-id not found');
    });
  });

  describe('getEntry', () => {
    it('should get an entry', async () => {
      const backend = new MemoryBackend();
      const entryData: Omit<Entry, 'id'> = {
        accountId: 'accountId',
        transactionId: 'transactionId',
        side: 'DEBIT',
        amount: new Decimal(0),
        date: new Date(),
      };
      const entryId = await backend.createEntry(entryData);
      const entry = await backend.getEntry(entryId);

      expect(entry).toEqual({
        id: entryId,
        ...entryData,
      });
    });

    it('should throw an error if the entry does not exist', async () => {
      const backend = new MemoryBackend();

      await expect(backend.getEntry('non-existent-entry-id')).rejects.toThrow(
        'Entry non-existent-entry-id not found',
      );
    });
  });
});
