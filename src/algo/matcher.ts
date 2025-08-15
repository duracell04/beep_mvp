import { layerA } from '../data/layerA';
import { layerB } from '../data/layerB';
import type { Question, UserAnswer } from '../data/types';

export interface MatchOutcome {
  score: number;
  color: 'green' | 'yellow' | 'red';
}

function similarity(q: Question, a: string | number, b: string | number): number {
  switch (q.type) {
    case 'yesno':
    case 'select':
      return a === b ? 1 : 0;
    case 'slider':
      return 1 - Math.abs(Number(a) - Number(b)) / 4;
    default:
      return 0;
  }
}

export function computeMatch(
  myAnswers: Record<string, UserAnswer>,
  peerAnswers: Record<string, UserAnswer>
): MatchOutcome {
  let total = 0;
  let weightSum = 0;

  const process = (
    questions: Question[],
    getWeight: (q: Question, a: UserAnswer) => number
  ): boolean => {
    for (const q of questions) {
      const my = myAnswers[q.id];
      const peer = peerAnswers[q.id];
      if (!my || !peer) continue;

      const sim = similarity(q, my.value, peer.value);
      const isDeal = q.dealBreaker || my.isDealBreaker || peer.isDealBreaker;
      const incompatible = q.type === 'slider' ? sim < 0.75 : sim < 1;
      if (isDeal && incompatible) return true;

      const weight = getWeight(q, my);
      total += sim * weight;
      weightSum += weight;
    }
    return false;
  };

  if (process(layerA, (q) => q.weight ?? 1)) return { score: 0, color: 'red' };
  if (process(layerB, (_q, a) => a.importance ?? 3))
    return { score: 0, color: 'red' };

  const score = weightSum ? total / weightSum : 0;
  const color: MatchOutcome['color'] =
    score >= 0.8 ? 'green' : score >= 0.5 ? 'yellow' : 'red';
  return { score, color };
}
