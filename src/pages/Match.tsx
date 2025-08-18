import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useQuiz } from '../contexts/QuizContext';
import MatchResult from '../components/MatchResult';
import { computeMatch, type MatchOutcome } from '../algo/matcher';

export default function Match() {
  const location = useLocation() as { state?: { peerToken?: string } };
  const peerToken = location.state?.peerToken;
  const { answers } = useQuiz();
  const [result, setResult] = useState<MatchOutcome | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        setResult(computeMatch(answers as Record<string, unknown>, {}));
        return;
      }
      if (!peerToken) return;

      const { data } = await supabase
        .from('sessions')
        .select('answers')
        .eq('token', peerToken)
        .single();

      if (data?.answers) {
        const res = computeMatch(
          answers as Record<string, unknown>,
          data.answers as Record<string, unknown>
        );
        setResult(res);
      }
    };
    run();
  }, [peerToken, answers]);

  if (!result) return <div className="p-4">Loading...</div>;
  return <MatchResult color={result.color} score={result.score} />;
}
