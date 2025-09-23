import { MemoryBackend } from '@germanamz/luca-backend-memory';
import {
  mockCreditAccountData,
  mockDebitAccountData,
} from '@germanamz/luca-common';

export const profitAccountPreset = async (backend: MemoryBackend) => {
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

  return {
    backend,
    profitAccountId,
    profitAccountData,
    expensesAccountId,
    expensesAccountData,
    revenueAccountId,
    revenueAccountData,
  };
};
