import Decimal from 'decimal.js';
import { calculateBalance } from '../src';

describe('lib', () => {
  describe('calculateBalance', () => {
    it('should calculate the balance for DEBIT', () => {
      expect(
        calculateBalance('DEBIT', new Decimal(10), new Decimal(5)),
      ).toEqual(new Decimal(5));
    });

    it('should calculate the balance for CREDIT', () => {
      expect(
        calculateBalance('CREDIT', new Decimal(10), new Decimal(5)),
      ).toEqual(new Decimal(-5));
    });
  });
});
