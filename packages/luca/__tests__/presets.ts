import {
  mockCreditAccountData,
  mockCreditEntryData,
  mockDebitAccountData,
  mockDebitEntryData,
} from '@germanamz/luca-common';
import { Luca } from '../src';
import { MemoryBackend } from '@germanamz/luca-backend-memory';
import Decimal from 'decimal.js';

export const profitAccountPreset = async () => {
  const backend = new MemoryBackend();
  const luca = new Luca(backend);
  const profitAccountData = mockCreditAccountData({
    name: 'Profit',
  });
  const profitAccountId = await backend.createAccount(profitAccountData);
  const expensesAccountData = mockDebitAccountData({
    name: 'Expenses',
    parentId: profitAccountId,
  });
  const expensesAccountId = await backend.createAccount(expensesAccountData);
  const revenueAccountData = mockCreditAccountData({
    name: 'Revenue',
    parentId: profitAccountId,
  });
  const revenueAccountId = await backend.createAccount(revenueAccountData);
  const expensesEntries = [
    await luca.createEntry(
      mockDebitEntryData({
        accountId: expensesAccountId,
        amount: new Decimal(100),
      }),
    ),
    await luca.createEntry(
      mockCreditEntryData({
        accountId: expensesAccountId,
        amount: new Decimal(10),
      }),
    ),
  ]; // Expenses (DEBIT) DEBITS: 100, CREDITS: 10, TOTAL: 90
  const revenueEntries = [
    await luca.createEntry(
      mockDebitEntryData({
        accountId: revenueAccountId,
        amount: new Decimal(10),
      }),
    ),
    await luca.createEntry(
      mockCreditEntryData({
        accountId: revenueAccountId,
        amount: new Decimal(110),
      }),
    ),
  ]; // Revenue (CREDIT) DEBITS: 10, CREDITS: 110, TOTAL: 100

  return {
    backend,
    luca,
    profitAccountId,
    profitAccountData,
    expensesAccountId,
    expensesAccountData,
    revenueAccountId,
    revenueAccountData,
    expensesEntries,
    revenueEntries,
  };
};
