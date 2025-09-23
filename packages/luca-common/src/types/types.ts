import { Decimal } from 'decimal.js';

export type Side = 'DEBIT' | 'CREDIT';

export type Account = {
  id: string;
  side: Side;
  name: string;
  credits: Decimal;
  debits: Decimal;
  parentId?: string;
};

export type Transaction = {
  id: string;
  amount: Decimal;
  date: Date;
  sourceAccountId: string;
  destinationAccountId: string;
  parentId?: string;
};

export type Entry = {
  id: string;
  amount: Decimal;
  side: Side;
  accountId: string;
  transactionId: string;
  date: Date;
};
