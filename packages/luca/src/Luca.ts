import { Backend, inverseSide } from '@germanamz/luca-common';
import { CreateTransactionRequest, CreateEntryRequest } from './types';

export class Luca {
  readonly backend: Backend;

  constructor(backend: Backend) {
    this.backend = backend;
  }

  async createEntry(request: CreateEntryRequest) {
    const { accountId, transactionId, side, amount, date } = request;
    const entryId = await this.backend.createEntry({
      accountId,
      transactionId,
      side,
      amount,
      date,
    });
    let accId: string | undefined = accountId;

    while (accId) {
      let { credits, debits, parentId } = await this.backend.getAccount(accId);

      if (side === 'CREDIT') {
        credits = credits.add(amount);
      } else {
        debits = debits.add(amount);
      }

      await this.backend.updateAccount(accId, {
        credits,
        debits,
      });

      accId = parentId;
    }

    return entryId;
  }

  async createTransaction({
    amount,
    destinationAccountId,
    sourceAccountId,
    concept,
    parentId,
    date,
  }: CreateTransactionRequest) {
    const sourceAcc = await this.backend.getAccount(sourceAccountId);
    const destinationAcc = await this.backend.getAccount(destinationAccountId);
    const transactionId = await this.backend.createTransaction({
      concept,
      amount,
      destinationAccountId,
      sourceAccountId,
      parentId,
      date,
    });
    const sameSideSrcAndDest = sourceAcc.side === destinationAcc.side;
    // If the source and destination accounts have the same side, this means that they are on the same side of the accounting equation,
    // therefore the source entry should be on the opposite side of the account's normal side (decrease the source account balance)
    const sourceSide = sameSideSrcAndDest
      ? inverseSide(sourceAcc.side)
      : sourceAcc.side;
    const sourceEntryId = await this.createEntry({
      accountId: sourceAccountId,
      transactionId,
      side: sourceSide,
      amount,
      date,
    });
    const destinationEntryId = await this.createEntry({
      accountId: destinationAccountId,
      transactionId,
      side: destinationAcc.side,
      amount,
      date,
    });

    return {
      transactionId,
      destinationEntryId,
      sourceEntryId,
    };
  }
}
