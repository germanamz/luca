import { Account, Backend, Entry, Transaction } from '@germanamz/luca-common';
import { MemoryBackend } from './MemoryBackend';

export type Actions =
  | 'createAccount'
  | 'createTransaction'
  | 'createEntry'
  | 'updateAccount';

export type Observer = <A, R>(action: Actions, args: A, result: R) => void;

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

  createAccount(account: Omit<Account, 'id'>): string {
    const id = super.createAccount(account);
    this.notify('createAccount', account, id);
    return id;
  }

  createTransaction(transaction: Omit<Transaction, 'id'>): string {
    const id = super.createTransaction(transaction);
    this.notify('createTransaction', transaction, id);
    return id;
  }

  createEntry(entry: Omit<Entry, 'id'>): string {
    const id = super.createEntry(entry);
    this.notify('createEntry', entry, id);
    return id;
  }

  updateAccount(
    accountId: string,
    account: Partial<Omit<Account, 'id'>>,
  ): void {
    super.updateAccount(accountId, account);
    this.notify('updateAccount', accountId, account);
  }
}
