import { Backend } from '@germanamz/luca-common';
import Decimal from 'decimal.js';

export const mockBackend = (props?: Partial<Backend>): Backend => ({
  createTransaction: vi.fn().mockResolvedValue('transactionId'),
  createEntry: vi.fn().mockResolvedValue('entryId'),
  getAccount: vi.fn().mockResolvedValue({
    id: 'accountId',
    side: 'DEBIT',
    credits: new Decimal(0),
    debits: new Decimal(0),
  }),
  getTransaction: vi.fn().mockResolvedValue({
    id: 'transactionId',
    sourceAccountId: 'sourceAccountId',
    destinationAccountId: 'destinationAccountId',
    amount: new Decimal(0),
    date: new Date(),
  }),
  getEntry: vi.fn().mockResolvedValue({
    id: 'entryId',
    accountId: 'accountId',
    transactionId: 'transactionId',
    side: 'DEBIT',
    amount: new Decimal(0),
    date: new Date(),
  }),
  updateAccount: vi.fn(),
  getAccountChildren: vi.fn().mockResolvedValue([
    {
      id: 'accountId',
      side: 'DEBIT',
      credits: new Decimal(0),
      debits: new Decimal(0),
    },
  ]),
  ...props,
});
