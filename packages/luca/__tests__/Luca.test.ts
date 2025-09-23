import { MemoryBackend } from '@germanamz/luca-backend-memory';
import { Luca } from '../src';
import { Decimal } from 'decimal.js';
import { inverseSide, mockEntryData, Side } from '@germanamz/luca-common';
import { profitAccountPreset } from './presets';
import { mockBackend } from './mocks';

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
      } = profitAccountPreset(backend);
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
      const profitAccount = backend.getAccount(profitAccountId);
      const expensesAccount = backend.getAccount(expensesAccountId);
      const revenueAccount = backend.getAccount(revenueAccountId);
      const expensesEntry = backend.getEntry(expensesEntryId);
      const revenueEntry = backend.getEntry(revenueEntryId);

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

    it('should create a entry and update the account and its parents balance with a context', async () => {
      const backend = mockBackend();
      const luca = new Luca(backend);
      const ctx = { a: 'a' };
      const expensesEntryData = mockEntryData({
        accountId: 'expensesAccountId',
        amount: new Decimal(10),
        side: 'DEBIT',
      });

      await luca.createEntry(expensesEntryData, ctx);

      expect(backend.createEntry).toHaveBeenCalledWith(expensesEntryData, ctx);
      expect(backend.getAccount).toHaveBeenCalledWith('expensesAccountId', ctx);
      expect(backend.updateAccount).toHaveBeenCalledWith(
        'expensesAccountId',
        {
          credits: new Decimal(0),
          debits: new Decimal(10),
        },
        ctx,
      );
    });
  });

  describe('createTransaction', () => {
    it.each([
      {
        sourceSide: 'DEBIT',
        destinationSide: 'DEBIT',
      },
      {
        sourceSide: 'CREDIT',
        destinationSide: 'DEBIT',
      },
    ])(
      'should create a transaction from account with $sourceSide side to account with $destinationSide side',
      async ({ sourceSide, destinationSide }) => {
        const backend = new MemoryBackend();
        const sourceAccountId = backend.createAccount({
          side: sourceSide as Side,
          credits: new Decimal(0),
          debits: new Decimal(0),
        });
        const destinationAccountId = backend.createAccount({
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
            date: new Date(),
          });
        const transaction = backend.getTransaction(transactionId);
        const sourceEntry = backend.getEntry(sourceEntryId);
        const destinationEntry = backend.getEntry(destinationEntryId);

        expect(transaction).toEqual({
          id: transactionId,
          sourceAccountId,
          destinationAccountId,
          amount: new Decimal(100),
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

  it('should create a transaction and update the accounts and their parents balance with a context', async () => {
    const backend = mockBackend();
    const luca = new Luca(backend);
    const ctx = { a: 'a' };
    await luca.createTransaction(
      {
        sourceAccountId: 'sourceAccountId',
        destinationAccountId: 'destinationAccountId',
        amount: new Decimal(100),
        date: new Date(),
      },
      ctx,
    );

    expect(backend.createTransaction).toHaveBeenCalledWith(
      {
        sourceAccountId: 'sourceAccountId',
        destinationAccountId: 'destinationAccountId',
        amount: new Decimal(100),
        date: expect.any(Date),
      },
      ctx,
    );
    expect(backend.getAccount).toHaveBeenCalledWith('sourceAccountId', ctx);
    expect(backend.getAccount).toHaveBeenCalledWith(
      'destinationAccountId',
      ctx,
    );
    expect(backend.createEntry).toHaveBeenCalledWith(
      {
        accountId: 'sourceAccountId',
        transactionId: 'transactionId',
        side: 'CREDIT',
        amount: new Decimal(100),
        date: expect.any(Date),
      },
      ctx,
    );
    expect(backend.createEntry).toHaveBeenCalledWith(
      {
        accountId: 'destinationAccountId',
        transactionId: 'transactionId',
        side: 'DEBIT',
        amount: new Decimal(100),
        date: expect.any(Date),
      },
      ctx,
    );
  });
});
