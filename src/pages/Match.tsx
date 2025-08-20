// src/pages/Match.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import MatchResult from '../components/MatchResult';
import { computeMatch, type MatchOutcome } from '../algo/matcher';
import { getPeerAnswers } from '../api/sessions';

export default function Match() {
  const location = useLocation() as { state?: { peerToken?: string } };
  const peerToken = location.state?.peerToken;
  const { answers } = useQuiz();
  const [result, setResult] = useState<MatchOutcome | null>(null);

  useEffect(() => {
    (async () => {
      if (!peerToken) return;
      const peer = await getPeerAnswers(peerToken);
      if (peer) {
        const r = computeMatch(
          answers as unknown as Record<string, unknown>,
          peer as Record<string, unknown>
        );
        setResult(r);
      }
    })();
  }, [peerToken, answers]);

  if (!result) return <div className="p-4">Loading...</div>;
  return <MatchResult color={result.color} score={result.score} />;
}
