import { MemoryBackend } from '@germanamz/luca-backend-memory';
import {
  mockCreditAccountData,
  mockDebitAccountData,
} from '@germanamz/luca-common';

export const profitAccountPreset = (backend: MemoryBackend) => {
  const profitAccountData = mockCreditAccountData();
  const profitAccountId = backend.createAccount(profitAccountData);
  const expensesAccountData = mockDebitAccountData({
    parentId: profitAccountId,
  });
  const expensesAccountId = backend.createAccount(expensesAccountData);
  const revenueAccountData = mockCreditAccountData({
    parentId: profitAccountId,
  });
  const revenueAccountId = backend.createAccount(revenueAccountData);

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
