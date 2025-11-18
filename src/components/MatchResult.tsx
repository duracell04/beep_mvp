import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

interface Props {
  color: 'green' | 'yellow' | 'red';
  score: number;
  topic: string;
  sparkLine: string;
  promptLine: string;
}

export default function MatchResult({ color, score, topic, sparkLine, promptLine }: Props) {
  const nav = useNavigate();
  const displayPercent = Math.max(85, Math.round(score * 100));
  const copyHook = () => {
    const payload = `${sparkLine} ${promptLine}`;
    navigator.clipboard?.writeText(payload).catch(() => {});
  };

  return (
    <div
      data-match-color={color}
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-emerald-500 via-emerald-500 to-lime-400 p-8 text-white shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_55%)]" />
      </div>

      <div className="relative flex flex-col items-center gap-6 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-white/70">
          Magic moment
        </p>
        <h1 className="text-4xl font-semibold">High compatibility!</h1>
        <div className="flex items-center gap-6">
          <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white/70 bg-white/10 text-5xl font-black">
            {displayPercent}%
          </div>
          <div className="text-left">
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">Break the Ice</p>
            <p className="text-lg font-semibold text-white">
              You unlocked live matching in Active Mode.
            </p>
          </div>
        </div>
        <div className="w-full rounded-3xl bg-white/15 p-6 text-left">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70">{topic}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{sparkLine}</p>
          <p className="mt-3 text-sm text-white/90">{promptLine}</p>
        </div>
        <div className="flex w-full flex-col gap-3 text-sm font-semibold uppercase tracking-[0.3em] sm:flex-row">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-none bg-white text-emerald-600"
            onClick={() => nav('/scan')}
          >
            Beep another
          </Button>
          <Button
            variant="ghost"
            className="flex-1 rounded-full border border-white/40 bg-transparent text-white"
            onClick={copyHook}
          >
            Copy starter
          </Button>
        </div>
      </div>
    </div>
  );
}
