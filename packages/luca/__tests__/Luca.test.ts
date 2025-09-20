import { MemoryBackend } from '@germanamz/luca-backend-memory';
import { Luca } from '../src';
import { Decimal } from 'decimal.js';
import {
  inverseSide,
  mockCreditAccountData,
  mockCreditEntryData,
  mockDebitAccountData,
  mockDebitEntryData,
  Side,
} from '@germanamz/luca-common';

describe('Luca', () => {
  describe('createEntry', () => {
    it.each(['DEBIT', 'CREDIT'])(
      "should create an entry and update the account's $0 balance",
      async (side) => {
        const backend = new MemoryBackend();
        const accountId = await backend.createAccount({
          name: 'Cash',
          side: 'DEBIT',
          credits: new Decimal(0),
          debits: new Decimal(0),
        });
        const luca = new Luca(backend);
        const entryId = await luca.createEntry({
          accountId,
          transactionId: 'transactionId',
          side: side as Side,
          amount: new Decimal(100),
          date: new Date(),
        });
        const entry = await backend.getEntry(entryId);
        const account = await backend.getAccount(accountId);

        expect(entry).toEqual({
          id: entryId,
          accountId,
          transactionId: 'transactionId',
          side: side as Side,
          amount: new Decimal(100),
          date: expect.any(Date),
        });
        expect(account).toEqual({
          id: accountId,
          name: 'Cash',
          side: 'DEBIT',
          credits: side === 'DEBIT' ? new Decimal(0) : new Decimal(100),
          debits: side === 'DEBIT' ? new Decimal(100) : new Decimal(0),
        });
      },
    );
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

  describe('getBalance', () => {
    it('should get the credits and debits balance of an account with no children', async () => {
      const backend = new MemoryBackend();
      const profitAccountData = mockCreditAccountData({
        name: 'Profit',
      });
      const profitAccountId = await backend.createAccount(profitAccountData);
      const luca = new Luca(backend);

      await luca.createEntry(
        mockDebitEntryData({
          accountId: profitAccountId,
          amount: new Decimal(100),
          date: new Date(),
        }),
      );
      await luca.createEntry(
        mockCreditEntryData({
          accountId: profitAccountId,
          amount: new Decimal(10),
          date: new Date(),
        }),
      );

      const balance = await luca.getBalance(profitAccountId);

      expect(balance).toEqual({
        debits: new Decimal(100),
        credits: new Decimal(10),
      });
    });

    it('should get the credits and debits balance of a composed account', async () => {
      const backend = new MemoryBackend();
      const profitAccountData = mockCreditAccountData({
        name: 'Profit',
      });
      const profitAccountId = await backend.createAccount(profitAccountData);
      const expensesAccountId = await backend.createAccount(
        mockDebitAccountData({
          name: 'Expenses',
          parentId: profitAccountId,
        }),
      );
      const revenueAccountId = await backend.createAccount(
        mockCreditAccountData({
          name: 'Revenue',
          parentId: profitAccountId,
        }),
      );
      const luca = new Luca(backend);

      await luca.createEntry(
        mockDebitEntryData({
          accountId: expensesAccountId,
          amount: new Decimal(100),
        }),
      );
      await luca.createEntry(
        mockCreditEntryData({
          accountId: revenueAccountId,
          amount: new Decimal(10),
        }),
      );
      await luca.createEntry(
        mockCreditEntryData({
          accountId: revenueAccountId,
          amount: new Decimal(100),
        }),
      );

      const balance = await luca.getBalance(profitAccountId);
      const profit = await backend.getAccount(profitAccountId);
      const expenses = await backend.getAccount(expensesAccountId);
      const revenue = await backend.getAccount(revenueAccountId);

      expect(balance).toEqual({
        debits: new Decimal(100),
        credits: new Decimal(110),
      });
      expect(profit).toEqual(
        expect.objectContaining({
          debits: new Decimal(0),
          credits: new Decimal(0),
        }),
      );
      expect(expenses).toEqual(
        expect.objectContaining({
          debits: new Decimal(100),
          credits: new Decimal(0),
        }),
      );
      expect(revenue).toEqual(
        expect.objectContaining({
          credits: new Decimal(110),
          debits: new Decimal(0),
        }),
      );
    });
  });
});
