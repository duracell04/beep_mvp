export interface MatchOutcome {
  score: number;
  color: 'green' | 'yellow' | 'red';
}

export function computeMatch(
  my: Record<string, string | number>,
  peer: Record<string, string | number>
): MatchOutcome {
  const score = Math.random();
  let color: MatchOutcome['color'];
  if (score >= 0.66) color = 'green';
  else if (score >= 0.33) color = 'yellow';
  else color = 'red';
  return { score, color };
}
