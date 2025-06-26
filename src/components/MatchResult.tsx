import React from 'react';

export default function MatchResult({
  color,
  score,
}: {
  color: 'green' | 'yellow' | 'red';
  score: number;
}) {
  const percent = Math.round(score * 100);
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div
        className="w-40 h-40 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="text-5xl font-bold" style={{ color }}>
        {percent}%
      </div>
    </div>
  );
}
