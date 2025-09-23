import { Account, Backend, Entry, Transaction } from '@germanamz/luca-common';

const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export class MemoryBackend implements Backend {
  idGenerator = generateId;

  accounts: Map<string, Account> = new Map();
  transactions: Map<string, Transaction> = new Map();
  entries: Map<string, Entry> = new Map();

  constructor(idGenerator?: () => string) {
    this.idGenerator = idGenerator || generateId;
  }

  createAccount(account: Omit<Account, 'id'>) {
    const id = this.idGenerator();
    this.accounts.set(id, { ...account, id });
    return id;
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): string {
    const id = this.idGenerator();
    this.transactions.set(id, { ...transaction, id });
    return id;
  }

  createEntry(entry: Omit<Entry, 'id'>) {
    const id = this.idGenerator();
    this.entries.set(id, { ...entry, id });
    return id;
  }

  getAccount(accountId: string): Account {
    const account = this.accounts.get(accountId);

    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    return { ...account }; // Clone the account to avoid mutating the original object
  }

  getAccountChildren(accountId: string): Account[] {
    return Array.from(this.accounts.values()).filter(
      (account) => account.parentId === accountId,
    );
  }

  updateAccount(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
  ): void {
    const originalAccount = this.getAccount(accountId);

    this.accounts.set(accountId, {
      ...originalAccount,
      ...account,
    });
  }

  getTransaction(transactionId: string): Transaction {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    return { ...transaction }; // Clone the transaction to avoid mutating the original object
  }

  getEntry(entryId: string): Entry {
    const entry = this.entries.get(entryId);

    if (!entry) {
      throw new Error(`Entry ${entryId} not found`);
    }

    return { ...entry }; // Clone the entry to avoid mutating the original object
  }
}
