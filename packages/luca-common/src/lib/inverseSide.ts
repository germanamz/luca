import { Side } from '../types';

export const inverseSide = (side: Side): Side => {
  return side === 'DEBIT' ? 'CREDIT' : 'DEBIT';
};
