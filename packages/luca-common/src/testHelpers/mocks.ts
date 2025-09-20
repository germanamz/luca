import { Account, Entry } from '@germanamz/luca-common';
import Decimal from 'decimal.js';

export const mockAccountData = (
  data: Partial<Omit<Account, 'id'>>,
): Omit<Account, 'id'> => {
  return {
    name: 'Account',
    side: 'DEBIT',
    credits: new Decimal(0),
    debits: new Decimal(0),
    parentId: undefined,
    ...data,
  };
};

export const mockDebitAccountData = (
  data: Partial<Omit<Account, 'id'>>,
): Omit<Account, 'id'> => {
  return mockAccountData({
    side: 'DEBIT',
    ...data,
  });
};

export const mockCreditAccountData = (
  data: Partial<Omit<Account, 'id'>>,
): Omit<Account, 'id'> => {
  return mockAccountData({
    side: 'CREDIT',
    ...data,
  });
};

export const mockEntryData = (
  data: Partial<Omit<Entry, 'id'>>,
): Omit<Entry, 'id'> => {
  return {
    amount: new Decimal(0),
    side: 'DEBIT',
    accountId: 'accountId',
    transactionId: 'transactionId',
    date: new Date(),
    ...data,
  };
};

export const mockDebitEntryData = (
  data: Partial<Omit<Entry, 'id'>>,
): Omit<Entry, 'id'> => {
  return mockEntryData({
    side: 'DEBIT',
    ...data,
  });
};

export const mockCreditEntryData = (
  data: Partial<Omit<Entry, 'id'>>,
): Omit<Entry, 'id'> => {
  return mockEntryData({
    side: 'CREDIT',
    ...data,
  });
};
