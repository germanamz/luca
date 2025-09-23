import { Account, Entry, Transaction } from './types';

export interface CreateBackend {
  createTransaction(transaction: Omit<Transaction, 'id'>): Promise<string>;
  createEntry(entry: Omit<Entry, 'id'>): Promise<string>;
}

export interface GetBackend {
  getAccount(accountId: string): Promise<Account>;
  getAccountChildren(accountId: string): Promise<Account[]>;
  getTransaction(transactionId: string): Promise<Transaction>;
  getEntry(entryId: string): Promise<Entry>;
}

export interface UpdateBackend {
  updateAccount(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
  ): Promise<void>;
}

export interface Backend extends CreateBackend, GetBackend, UpdateBackend {}
