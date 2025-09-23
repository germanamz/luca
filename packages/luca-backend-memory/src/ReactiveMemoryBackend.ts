import {
  Account,
  Backend,
  CreateBackend,
  Entry,
  Transaction,
  UpdateBackend,
} from '@germanamz/luca-common';
import { MemoryBackend } from './MemoryBackend';

type Actions = keyof CreateBackend | keyof UpdateBackend | 'createAccount';

type Observer = <A, R>(action: Actions, args: A, result: R) => void;

export class ReactiveMemoryBackend extends MemoryBackend implements Backend {
  private observers: Set<Observer> = new Set();

  on(observer: Observer) {
    this.observers.add(observer);
  }

  off(observer: Observer) {
    this.observers.delete(observer);
  }

  private notify<A, R>(action: Actions, args: A, result: R) {
    this.observers.forEach((observer) => observer(action, args, result));
  }

  async createAccount(account: Omit<Account, 'id'>): Promise<string> {
    const id = await super.createAccount(account);
    this.notify('createAccount', account, id);
    return id;
  }

  async createTransaction(
    transaction: Omit<Transaction, 'id'>,
  ): Promise<string> {
    const id = await super.createTransaction(transaction);
    this.notify('createTransaction', transaction, id);
    return id;
  }

  async createEntry(entry: Omit<Entry, 'id'>): Promise<string> {
    const id = await super.createEntry(entry);
    this.notify('createEntry', entry, id);
    return id;
  }

  async updateAccount(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
  ): Promise<void> {
    await super.updateAccount(accountId, account);
    this.notify('updateAccount', accountId, account);
  }
}
