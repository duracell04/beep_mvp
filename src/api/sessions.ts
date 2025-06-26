import { supabase } from '../supabaseClient';
import { computeMatch } from '../algo/matcher';

export interface Stats {
  participants: number;
  avgScore: number;
  colors: {
    green: number;
    yellow: number;
    red: number;
  };
}

export async function saveSession(
  token: string,
  eventCode: string,
  answers: Record<string, string | number>
) {
  await supabase
    .from('sessions')
    .upsert({ token, event_code: eventCode, answers });
}

export async function getStats(eventCode?: string): Promise<Stats> {
  let query = supabase.from('sessions').select('answers');
  if (eventCode) {
    query = query.eq('event_code', eventCode);
  }
  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as { answers: Record<string, string | number> }[];
  const participants = rows.length;
  const colors = { green: 0, yellow: 0, red: 0 };
  let scoreSum = 0;
  let count = 0;

  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const { score, color } = computeMatch(rows[i].answers, rows[j].answers);
      scoreSum += score;
      count++;
      colors[color]++;
    }
  }

  const avgScore = count ? scoreSum / count : 0;

  return { participants, avgScore, colors };
}
