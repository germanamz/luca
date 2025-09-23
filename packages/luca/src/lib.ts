import { Side } from '@germanamz/luca-common';
import { Decimal } from 'decimal.js';

export const calculateBalance = (
  side: Side,
  debits: Decimal,
  credits: Decimal,
): Decimal => {
  return side === 'CREDIT' ? credits.sub(debits) : debits.sub(credits);
};
