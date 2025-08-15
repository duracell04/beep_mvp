import { describe, it, expect } from 'vitest';
import { QrPayload } from '../schemas/qr';

const base = {
  event: '1234',
  token: '11111111-1111-1111-1111-111111111111',
  ts: Date.now(),
  exp: Date.now() + 120_000,
};

describe('QrPayload schema', () => {
  it('accepts valid payload', () => {
    expect(QrPayload.safeParse(base).success).toBe(true);
  });

  it('rejects bad event', () => {
    expect(QrPayload.safeParse({ ...base, event: 'abcd' }).success).toBe(false);
  });

  it('rejects bad uuid', () => {
    expect(QrPayload.safeParse({ ...base, token: 'not-uuid' }).success).toBe(false);
  });

  it('detects expired exp', () => {
    const parsed = QrPayload.safeParse({ ...base, exp: Date.now() - 1 });
    expect(parsed.success && Date.now() < parsed.data.exp).toBe(false);
  });
});
