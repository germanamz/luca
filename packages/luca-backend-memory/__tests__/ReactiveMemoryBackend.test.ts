import { Decimal } from 'decimal.js';
import { ReactiveMemoryBackend } from '../src';
import { Account, Entry, Transaction } from '@germanamz/luca-common';

describe('ReactiveMemoryBackend', () => {
  describe('createAccount', () => {
    it('should notify the observer when a new account is created', () => {
      const backend = new ReactiveMemoryBackend();
      const observer = vi.fn();

      backend.on(observer);

      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        name: 'Cash',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = backend.createAccount(accountData);

      expect(observer).toHaveBeenCalledWith(
        'createAccount',
        accountData,
        accountId,
      );
    });

    it('should not notify the observer when a new account is created when observer is removed', () => {
      const backend = new ReactiveMemoryBackend();
      const observer = vi.fn();

      backend.on(observer);
      backend.off(observer);

      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        name: 'Cash',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = backend.createAccount(accountData);

      expect(observer).not.toHaveBeenCalledWith(
        'createAccount',
        accountData,
        accountId,
      );
    });
  });

  describe('createTransaction', () => {
    it('should notify the observer when a new transaction is created', () => {
      const backend = new ReactiveMemoryBackend();
      const observer = vi.fn();

      backend.on(observer);

      const transactionData: Omit<Transaction, 'id'> = {
        amount: new Decimal(0),
        date: new Date(),
        sourceAccountId: 'sourceAccountId',
        destinationAccountId: 'destinationAccountId',
      };
      const transactionId = backend.createTransaction(transactionData);

      expect(observer).toHaveBeenCalledWith(
        'createTransaction',
        transactionData,
        transactionId,
      );
    });
  });

  describe('createEntry', () => {
    it('should notify the observer when a new entry is created', () => {
      const backend = new ReactiveMemoryBackend();
      const observer = vi.fn();

      backend.on(observer);

      const transactionData: Omit<Entry, 'id'> = {
        accountId: 'accountId',
        transactionId: 'transactionId',
        side: 'DEBIT',
        amount: new Decimal(0),
        date: new Date(),
      };
      const entryId = backend.createEntry(transactionData);

      expect(observer).toHaveBeenCalledWith(
        'createEntry',
        transactionData,
        entryId,
      );
    });
  });

  describe('updateAccount', () => {
    it('should notify the observer when an account is updated', () => {
      const backend = new ReactiveMemoryBackend();
      const observer = vi.fn();

      backend.on(observer);

      const accountData: Omit<Account, 'id'> = {
        side: 'DEBIT',
        name: 'Cash',
        credits: new Decimal(0),
        debits: new Decimal(0),
      };
      const accountId = backend.createAccount(accountData);

      backend.updateAccount(accountId, {
        name: 'Updated Cash',
      });

      expect(observer).toHaveBeenCalledWith('updateAccount', accountId, {
        name: 'Updated Cash',
      });
    });

    it('should throw an error if the account does not exist', () => {
      const backend = new ReactiveMemoryBackend();

      expect(() =>
        backend.updateAccount('non-existent-account-id', {
          name: 'Updated Cash',
        }),
      ).toThrow('Account non-existent-account-id not found');
    });
  });
});
