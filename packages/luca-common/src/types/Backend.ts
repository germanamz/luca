import { Account, Entry, Transaction } from './types';

export interface Backend {
  createAccount(account: Omit<Account, 'id'>): Promise<string>;
  createTransaction(transaction: Omit<Transaction, 'id'>): Promise<string>;
  createEntry(entry: Omit<Entry, 'id'>): Promise<string>;

  getAccount(accountId: string): Promise<Account>;
  getTransaction(transactionId: string): Promise<Transaction>;
  getEntry(entryId: string): Promise<Entry>;

  updateAccount(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
  ): Promise<void>;
}
