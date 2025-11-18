// src/pages/Match.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import MatchResult from '../components/MatchResult';
import { computeMatch, type MatchOutcome } from '../algo/matcher';
import { getPeerAnswers } from '../api/sessions';
import { rapidFireQuestions, describeSharedAnswer } from '../data/rapidFireQuestions';

type StoredAnswer = { value?: string | number };

const defaultInsight = {
  topic: 'Shared curiosity',
  sparkLine: 'You both just unlocked Active Mode to meet someone new.',
  promptLine: 'Ask them: What would make this summit a breakout success?'
};

function buildConversationInsight(
  mine: Record<string, StoredAnswer | undefined>,
  peer: Record<string, StoredAnswer | undefined>
) {
  for (const question of rapidFireQuestions) {
    const myValue = mine[question.id]?.value;
    const peerValue = peer[question.id]?.value;
    if (myValue && peerValue && myValue === peerValue) {
      const option = question.options.find((opt) => opt.value === myValue);
      const label = option?.label ?? String(myValue);
      return describeSharedAnswer(question.id, label);
    }
  }
  return defaultInsight;
}

export default function Match() {
  const location = useLocation() as { state?: { peerToken?: string } };
  const peerToken = location.state?.peerToken;
  const { answers } = useQuiz();
  const [result, setResult] = useState<{
    outcome: MatchOutcome;
    topic: string;
    sparkLine: string;
    promptLine: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      if (!peerToken) return;
      const peer = await getPeerAnswers(peerToken);
      if (peer) {
        const r = computeMatch(
          answers as unknown as Record<string, unknown>,
          peer as Record<string, unknown>
        );
        const insight = buildConversationInsight(
          answers as Record<string, StoredAnswer>,
          peer as Record<string, StoredAnswer>
        );
        setResult({ outcome: r, ...insight });
      }
    })();
  }, [peerToken, answers]);

  if (!result) return <div className="p-4">Loading...</div>;
  return (
    <MatchResult
      color={result.outcome.color}
      score={result.outcome.score}
      topic={result.topic}
      sparkLine={result.sparkLine}
      promptLine={result.promptLine}
    />
  );
}
