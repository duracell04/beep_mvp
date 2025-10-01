import { describe, expect, it, vi } from 'vitest';

vi.mock('@/data/questions', () => ({
  layerAQuestions: [
    { id: 'a1', text: 'Q1', layer: 'A' as const, weight: 1 },
    { id: 'a2', text: 'Q2', layer: 'A' as const, weight: 2 },
  ],
  layerBQuestions: [
    { id: 'b1', text: 'Preference 1', layer: 'B' as const },
    { id: 'b2', text: 'Preference 2', layer: 'B' as const },
  ],
}));

import { match } from '@/algo/matcher';
import type { QuizAnswers } from '@/data/questions';

const baseAnswers: QuizAnswers = {
  eventCode: 'ABCD',
  layerA: { a1: 'x', a2: 'y' },
  layerB: [
    { questionId: 'b1', value: 'yes', importance: 'medium', dealBreaker: false },
    { questionId: 'b2', value: 'often', importance: 'high', dealBreaker: true },
  ],
};

describe('match()', () => {
  it('returns green for perfect alignment', () => {
    const res = match(baseAnswers, { ...baseAnswers });
    expect(res.color).toBe('green');
    expect(res.score).toBeCloseTo(1, 5);
    expect(res.pct).toBe(100);
  });

  it('returns red when a deal-breaker mismatches', () => {
    const peer: QuizAnswers = {
      ...baseAnswers,
      layerB: [
        { questionId: 'b1', value: 'yes', importance: 'medium', dealBreaker: false },
        { questionId: 'b2', value: 'rarely', importance: 'medium', dealBreaker: false },
      ],
    };
    const res = match(baseAnswers, peer);
    expect(res.color).toBe('red');
    expect(res.score).toBe(0);
    expect(res.breakdown.layerB.dealBreakerTriggered).toBe(true);
  });

  it('returns yellow for partial alignment', () => {
    const me: QuizAnswers = {
      ...baseAnswers,
      layerA: { a1: 'x', a2: 'y' },
      layerB: [
        { questionId: 'b1', value: 'yes', importance: 'medium', dealBreaker: false },
        { questionId: 'b2', value: 'often', importance: 'low', dealBreaker: false },
      ],
    };

    const peer: QuizAnswers = {
      ...baseAnswers,
      layerA: { a1: 'x', a2: 'z' },
      layerB: [
        { questionId: 'b1', value: 'no', importance: 'medium', dealBreaker: false },
        { questionId: 'b2', value: 'often', importance: 'medium', dealBreaker: false },
      ],
    };

    const res = match(me, peer);
    expect(res.color).toBe('yellow');
    expect(res.score).toBeGreaterThan(0.5);
    expect(res.score).toBeLessThan(0.8);
  });
});
