import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useQuiz } from '../contexts/QuizContext';
import MatchResult from '../components/MatchResult';
import { computeMatch, MatchOutcome } from '../algo/matcher';

export default function Match() {
  const location = useLocation() as { state?: { peerToken?: string } };
  const peerToken = location.state?.peerToken;
  const { answers } = useQuiz();
  const [result, setResult] = useState<MatchOutcome | null>(null);

  useEffect(() => {
    const fetchPeer = async () => {
      if (!peerToken) return;
      const { data } = await supabase
        .from('sessions')
        .select('answers')
        .eq('token', peerToken)
        .single();
      if (data?.answers) {
        const res = computeMatch(
          answers,
          data.answers as Record<string, string | number>
        );
        setResult(res);
      }
    };
    fetchPeer();
  }, [peerToken, answers]);

  if (!result) {
    return <div className="p-4">Loading...</div>;
  }

  return <MatchResult color={result.color} score={result.score} />;
}
