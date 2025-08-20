// src/api/sessions.ts
import { store, type Stats } from './store';

export async function saveSession(
  token: string,
  eventCode: string,
  answers: Record<string, unknown>
) {
  return store.saveSession(token, eventCode, answers);
}

export async function getStats(eventCode?: string): Promise<Stats> {
  return store.getStats(eventCode);
}

export async function getPeerAnswers(token: string): Promise<Record<string, unknown> | null> {
  return store.getPeerAnswers(token);
}
