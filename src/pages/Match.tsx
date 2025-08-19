import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useQuiz } from '../contexts/QuizContext';
import { computeMatch, type MatchOutcome } from '../algo/matcher';
import Button from '../components/ui/Button';

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

  const nav = useNavigate();
  if (!result) return <div className="p-4">Loading...</div>;
  const percent = Math.round(result.score * 100);
  const ringColor =
    result.color === 'green'
      ? 'var(--beep-bot)'
      : result.color === 'yellow'
      ? 'var(--beep-mid)'
      : 'var(--beep-top)';

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div
        className="flex h-48 w-48 items-center justify-center rounded-full border-8"
        style={{ borderColor: ringColor, color: ringColor }}
      >
        <span className="text-5xl font-bold">{percent}%</span>
      </div>
      <p className="text-slate-600 dark:text-slate-300">
        {percent >= 80
          ? 'Great match!'
          : percent >= 50
          ? 'Could be a fit!'
          : 'Maybe not this time.'}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => nav('/scan')}>
          Scan another
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
        >
          Share
        </Button>
      </div>
    </div>
  );
}
