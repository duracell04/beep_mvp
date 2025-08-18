export interface MatchOutcome {
  score: number;
  color: 'green' | 'yellow' | 'red';
}

export function computeMatch(
  _my: Record<string, unknown>,
  _peer: Record<string, unknown>
): MatchOutcome {
  const score = Math.random();
  const color = score >= 0.66 ? 'green' : score >= 0.33 ? 'yellow' : 'red';
  return { score, color };
}
