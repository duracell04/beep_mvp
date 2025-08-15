import { describe, it, expect, vi } from 'vitest';
import type { UserAnswer } from '../data/types';

vi.mock('../data/layerA', () => ({
  layerA: [
    { id: 'q1', type: 'yesno', weight: 2 },
    { id: 'q2', type: 'slider', weight: 3 },
    { id: 'q3', type: 'select', options: ['a', 'b'], weight: 1 },
  ],
}));

vi.mock('../data/layerB', () => ({
  layerB: [
    { id: 'b1', type: 'yesno' },
    { id: 'b2', type: 'slider' },
  ],
}));

import { computeMatch } from '../algo/matcher';

describe('computeMatch', () => {
  it('identical answers → green & ~1.0', () => {
    const answers: Record<string, UserAnswer> = {
      q1: { value: 'yes' },
      q2: { value: 3 },
      q3: { value: 'a' },
      b1: { value: 'no', importance: 5 },
      b2: { value: 4, importance: 1 },
    };
    const res = computeMatch(answers, answers);
    expect(res.color).toBe('green');
    expect(res.score).toBeGreaterThan(0.99);
  });

  it('deal-breaker mismatch → red & 0', () => {
    const me: Record<string, UserAnswer> = {
      b1: { value: 'yes', importance: 5, isDealBreaker: true },
    };
    const other: Record<string, UserAnswer> = {
      b1: { value: 'no', importance: 5 },
    };
    const res = computeMatch(me, other);
    expect(res.color).toBe('red');
    expect(res.score).toBe(0);
  });

  it('partial alignment with mixed weights → yellow between 0.5 and 0.8', () => {
    const me: Record<string, UserAnswer> = {
      q1: { value: 'yes' }, // match weight2
      q2: { value: 4 }, // slider close to peer weight3
      b1: { value: 'yes', importance: 1 }, // mismatch low weight
      b2: { value: 3, importance: 5 }, // slider mid diff high weight
    };
    const peer: Record<string, UserAnswer> = {
      q1: { value: 'yes' },
      q2: { value: 5 },
      b1: { value: 'no', importance: 1 },
      b2: { value: 5, importance: 5 },
    };
    const res = computeMatch(me, peer);
    expect(res.color).toBe('yellow');
    expect(res.score).toBeGreaterThan(0.5);
    expect(res.score).toBeLessThan(0.8);
  });

  it('sliders distance reduces similarity', () => {
    const me: Record<string, UserAnswer> = {
      b2: { value: 1, importance: 3 },
    };
    const peer: Record<string, UserAnswer> = {
      b2: { value: 3, importance: 3 },
    };
    const res = computeMatch(me, peer);
    expect(res.score).toBeCloseTo(0.5);
    expect(res.color).toBe('yellow');
  });
});
