import { Account, Entry, Transaction } from './types';

export type MaybePromise<T> = T | Promise<T>;

export interface Backend {
  createTransaction<C>(
    transaction: Omit<Transaction, 'id'>,
    ctx?: C,
  ): MaybePromise<string>;
  createEntry<C>(entry: Omit<Entry, 'id'>, ctx?: C): MaybePromise<string>;

  getAccount<C>(accountId: string, ctx?: C): MaybePromise<Account>;
  getAccountChildren<C>(accountId: string, ctx?: C): MaybePromise<Account[]>;
  getTransaction<C>(transactionId: string, ctx?: C): MaybePromise<Transaction>;
  getEntry<C>(entryId: string, ctx?: C): MaybePromise<Entry>;

  updateAccount<C>(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
    ctx?: C,
  ): MaybePromise<void>;
}
