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

  async createAccount(account: Omit<Account, 'id'>): Promise<string> {
    const id = this.idGenerator();
    this.accounts.set(id, { ...account, id });
    return id;
  }

  async createTransaction(
    transaction: Omit<Transaction, 'id'>,
  ): Promise<string> {
    const id = this.idGenerator();
    this.transactions.set(id, { ...transaction, id });
    return id;
  }

  async createEntry(entry: Omit<Entry, 'id'>): Promise<string> {
    const id = this.idGenerator();
    this.entries.set(id, { ...entry, id });
    return id;
  }

  async getAccount(accountId: string): Promise<Account> {
    const account = this.accounts.get(accountId);

    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    return { ...account }; // Clone the account to avoid mutating the original object
  }

  async updateAccount(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
  ): Promise<void> {
    const originalAccount = await this.getAccount(accountId);

    this.accounts.set(accountId, {
      ...originalAccount,
      ...account,
    });
  }

  async getTransaction(transactionId: string): Promise<Transaction> {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    return { ...transaction }; // Clone the transaction to avoid mutating the original object
  }

  async getEntry(entryId: string): Promise<Entry> {
    const entry = this.entries.get(entryId);

    if (!entry) {
      throw new Error(`Entry ${entryId} not found`);
    }

    return { ...entry }; // Clone the entry to avoid mutating the original object
  }
}
