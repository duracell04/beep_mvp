import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

interface Props {
  color: 'green' | 'yellow' | 'red';
  score: number;
}

export default function MatchResult({ color, score }: Props) {
  const nav = useNavigate();
  const percent = Math.round(score * 100);
  const ringColor =
    color === 'green'
      ? 'var(--beep-bot)'
      : color === 'yellow'
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
