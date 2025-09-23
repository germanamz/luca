import { Decimal } from 'decimal.js';
import { Side } from '@germanamz/luca-common';

export type CreateEntryRequest = {
  accountId: string;
  transactionId: string;
  side: Side;
  amount: Decimal;
  date: Date;
};

export type CreateTransactionRequest = {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: Decimal;
  date: Date;
  parentId?: string;
};
