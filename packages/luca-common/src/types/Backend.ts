import { Account, Entry, Transaction } from './types';

export type MaybePromise<T> = T | Promise<T>;

export interface Backend {
  createTransaction(transaction: Omit<Transaction, 'id'>): MaybePromise<string>;
  createEntry(entry: Omit<Entry, 'id'>): MaybePromise<string>;

  getAccount(accountId: string): MaybePromise<Account>;
  getAccountChildren(accountId: string): MaybePromise<Account[]>;
  getTransaction(transactionId: string): MaybePromise<Transaction>;
  getEntry(entryId: string): MaybePromise<Entry>;

  updateAccount(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
  ): MaybePromise<void>;
}
