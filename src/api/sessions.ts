import { store, type Stats } from './store';
import type { QuizAnswers } from '@/data/questions';

export const saveSession = (token: string, eventCode: string, answers: QuizAnswers) =>
  store.saveSession(token, eventCode, answers);

export const getPeerAnswers = (token: string) => store.getPeerAnswers(token);

export const getStats = (eventCode: string): Promise<Stats> => store.getStats(eventCode);

export type { Stats };
