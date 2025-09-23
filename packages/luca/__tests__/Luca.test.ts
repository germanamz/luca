import { MemoryBackend } from '@germanamz/luca-backend-memory';
import { Luca } from '../src';
import { Decimal } from 'decimal.js';
import { inverseSide, mockEntryData, Side } from '@germanamz/luca-common';
import { profitAccountPreset } from './presets';

describe('Luca', () => {
  describe('createEntry', () => {
    it('should create a entry and update the account and its parents balance', async () => {
      const backend = new MemoryBackend();
      const luca = new Luca(backend);
      const {
        profitAccountId,
        profitAccountData,
        expensesAccountId,
        expensesAccountData,
        revenueAccountId,
        revenueAccountData,
      } = await profitAccountPreset(backend);
      const expensesEntryData = mockEntryData({
        accountId: expensesAccountId,
        amount: new Decimal(10),
        side: expensesAccountData.side,
      });
      const expensesEntryId = await luca.createEntry(expensesEntryData);
      const revenueEntryData = mockEntryData({
        accountId: revenueAccountId,
        amount: new Decimal(100),
        side: revenueAccountData.side,
      });
      const revenueEntryId = await luca.createEntry(revenueEntryData);
      const profitAccount = await backend.getAccount(profitAccountId);
      const expensesAccount = await backend.getAccount(expensesAccountId);
      const revenueAccount = await backend.getAccount(revenueAccountId);
      const expensesEntry = await backend.getEntry(expensesEntryId);
      const revenueEntry = await backend.getEntry(revenueEntryId);

      expect(expensesEntry).toEqual({
        ...expensesEntryData,
        id: expensesEntryId,
      });
      expect(revenueEntry).toEqual({
        ...revenueEntryData,
        id: revenueEntryId,
      });
      expect(profitAccount).toEqual({
        ...profitAccountData,
        id: profitAccountId,
        credits: new Decimal(100),
        debits: new Decimal(10),
      });
      expect(expensesAccount).toEqual({
        ...expensesAccountData,
        id: expensesAccountId,
        credits: new Decimal(0),
        debits: new Decimal(10),
      });
      expect(revenueAccount).toEqual({
        ...revenueAccountData,
        id: revenueAccountId,
        credits: new Decimal(100),
        debits: new Decimal(0),
      });
    });
  });

  describe('createTransaction', () => {
    it.each([
      {
        sourceSide: 'DEBIT',
        sourceName: 'Cash',
        destinationSide: 'DEBIT',
        destinationName: 'Land',
      },
      {
        sourceSide: 'CREDIT',
        sourceName: 'Credit Card',
        destinationSide: 'DEBIT',
        destinationName: 'Equipment',
      },
    ])(
      'should create a transaction from $sourceName ($sourceSide) to $destinationName ($destinationSide)',
      async ({ sourceSide, sourceName, destinationSide, destinationName }) => {
        const backend = new MemoryBackend();
        const sourceAccountId = await backend.createAccount({
          name: sourceName,
          side: sourceSide as Side,
          credits: new Decimal(0),
          debits: new Decimal(0),
        });
        const destinationAccountId = await backend.createAccount({
          name: destinationName,
          side: destinationSide as Side,
          credits: new Decimal(0),
          debits: new Decimal(0),
        });
        const luca = new Luca(backend);
        const { transactionId, sourceEntryId, destinationEntryId } =
          await luca.createTransaction({
            sourceAccountId,
            destinationAccountId,
            amount: new Decimal(100),
            concept: 'Test Transaction',
            date: new Date(),
          });
        const transaction = await backend.getTransaction(transactionId);
        const sourceEntry = await backend.getEntry(sourceEntryId);
        const destinationEntry = await backend.getEntry(destinationEntryId);

        expect(transaction).toEqual({
          id: transactionId,
          sourceAccountId,
          destinationAccountId,
          amount: new Decimal(100),
          concept: 'Test Transaction',
          date: expect.any(Date),
        });
        expect(sourceEntry).toEqual({
          id: sourceEntryId,
          accountId: sourceAccountId,
          transactionId,
          side:
            sourceSide === destinationSide
              ? inverseSide(sourceSide as Side)
              : sourceSide,
          amount: new Decimal(100),
          date: expect.any(Date),
        });
        expect(destinationEntry).toEqual({
          id: destinationEntryId,
          accountId: destinationAccountId,
          transactionId,
          side: destinationSide as Side,
          amount: new Decimal(100),
          date: expect.any(Date),
        });
      },
    );
  });
});
