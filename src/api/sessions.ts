import { supabase } from '../supabaseClient';

export async function saveSession(
  token: string,
  eventCode: string,
  answers: Record<string, string | number>
) {
  await supabase
    .from('sessions')
    .upsert({ token, event_code: eventCode, answers });
}
