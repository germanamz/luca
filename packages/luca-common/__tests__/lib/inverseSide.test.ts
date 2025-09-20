import { inverseSide } from '../../src/lib';

describe('inverseSide', () => {
  it('should inverse DEBIT to CREDIT', () => {
    expect(inverseSide('DEBIT')).toBe('CREDIT');
  });

  it('should inverse CREDIT to DEBIT', () => {
    expect(inverseSide('CREDIT')).toBe('DEBIT');
  });
});
