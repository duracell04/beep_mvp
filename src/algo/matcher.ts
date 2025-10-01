import { layerAQuestions, layerBQuestions, type QuizAnswers, type LayerBAnswer, type ImportanceLevel } from '@/data/questions';

export type MatchColor = 'green' | 'yellow' | 'red';

export interface MatchBreakdown {
  layerA: {
    score: number;
    matchedWeight: number;
    totalWeight: number;
    details: Array<{
      questionId: string;
      myAnswer?: string;
      peerAnswer?: string;
      weight: number;
      matched: boolean;
    }>;
  };
  layerB: {
    score: number;
    dealBreakerTriggered: boolean;
    directions: {
      meToPeer: PreferenceBreakdown;
      peerToMe: PreferenceBreakdown;
    };
  };
}

interface PreferenceBreakdown {
  score: number;
  matchedWeight: number;
  totalWeight: number;
  dealBreakerTriggered: boolean;
  details: Array<{
    questionId: string;
    myPreference?: string;
    peerPreference?: string;
    importance: ImportanceLevel;
    weight: number;
    satisfied: boolean;
    dealBreaker: boolean;
  }>;
}

export interface MatchResult {
  score: number;
  pct: number;
  color: MatchColor;
  breakdown: MatchBreakdown;
}

const importanceWeights: Record<ImportanceLevel, number> = {
  low: 0.5,
  medium: 1,
  high: 1.5,
};

const layerAIndex = new Map(layerAQuestions.map((q) => [q.id, q]));
const layerBIndex = new Map(layerBQuestions.map((q) => [q.id, q]));

export function match(me: QuizAnswers, peer: QuizAnswers): MatchResult {
  const layerA = evaluateLayerA(me, peer);
  const mePrefs = evaluatePreferences(me.layerB, peer.layerB);
  const peerPrefs = evaluatePreferences(peer.layerB, me.layerB);

  const dealBreakerTriggered = mePrefs.dealBreakerTriggered || peerPrefs.dealBreakerTriggered;
  const layerBScore = (mePrefs.score + peerPrefs.score) / 2;

  const compositeScore = dealBreakerTriggered ? 0 : (layerA.score * 0.6) + (layerBScore * 0.4);
  const color = scoreToColor(compositeScore);

  return {
    score: compositeScore,
    pct: Math.round(compositeScore * 100),
    color,
    breakdown: {
      layerA,
      layerB: {
        score: layerBScore,
        dealBreakerTriggered,
        directions: {
          meToPeer: mePrefs,
          peerToMe: peerPrefs,
        },
      },
    },
  };
}

function evaluateLayerA(me: QuizAnswers, peer: QuizAnswers): MatchBreakdown['layerA'] {
  let matchedWeight = 0;
  let totalWeight = 0;
  const details: MatchBreakdown['layerA']['details'] = [];

  for (const [questionId, question] of layerAIndex.entries()) {
    const weight = question.weight ?? 1;
    const myAnswer = me.layerA[questionId];
    const peerAnswer = peer.layerA[questionId];

    if (!myAnswer || !peerAnswer) {
      continue;
    }

    totalWeight += weight;
    const matched = myAnswer === peerAnswer;
    if (matched) {
      matchedWeight += weight;
    }

    details.push({
      questionId,
      myAnswer,
      peerAnswer,
      weight,
      matched,
    });
  }

  const score = totalWeight > 0 ? matchedWeight / totalWeight : 0;
  return { score, matchedWeight, totalWeight, details };
}

function evaluatePreferences(
  mine: LayerBAnswer[],
  peers: LayerBAnswer[],
): PreferenceBreakdown {
  let matchedWeight = 0;
  let totalWeight = 0;
  let dealBreakerTriggered = false;
  const details: PreferenceBreakdown['details'] = [];

  for (const pref of mine) {
    const config = layerBIndex.get(pref.questionId);
    if (!config) continue;
    const weight = importanceWeights[pref.importance];
    const peerPref = peers.find((p) => p.questionId === pref.questionId);

    if (!peerPref) {
      // unanswered preferences neither help nor hurt but keep in breakdown
      details.push({
        questionId: pref.questionId,
        myPreference: pref.value,
        peerPreference: undefined,
        importance: pref.importance,
        weight,
        satisfied: false,
        dealBreaker: pref.dealBreaker,
      });
      continue;
    }

    totalWeight += weight;
    const satisfied = pref.value === peerPref.value;
    if (satisfied) {
      matchedWeight += weight;
    } else if (pref.dealBreaker) {
      dealBreakerTriggered = true;
    }

    details.push({
      questionId: pref.questionId,
      myPreference: pref.value,
      peerPreference: peerPref.value,
      importance: pref.importance,
      weight,
      satisfied,
      dealBreaker: pref.dealBreaker,
    });
  }

  const score = totalWeight > 0 ? matchedWeight / totalWeight : 0;
  return { score, matchedWeight, totalWeight, dealBreakerTriggered, details };
}

function scoreToColor(score: number): MatchColor {
  if (score >= 0.8) return 'green';
  if (score >= 0.5) return 'yellow';
  return 'red';
}

export const computeMatch = match;
