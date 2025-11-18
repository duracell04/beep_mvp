import { match, type MatchResult } from '@/algo/matcher';
import type { QuizAnswers } from '@/data/questions';

type StoredSession = {
  token: string;
  eventCode: string;
  answers: QuizAnswers;
  updatedAt: number;
};

export interface Stats {
  participants: number;
  avgScore?: number;
  colors: Record<'green' | 'yellow' | 'red', number>;
}

export interface Store {
  saveSession(token: string, eventCode: string, answers: QuizAnswers): Promise<void>;
  getPeerAnswers(token: string): Promise<QuizAnswers | null>;
  getStats(eventCode: string): Promise<Stats>;
}

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export const store: Store = backend ? createHttpStore(backend) : createLocalStore();

function createLocalStore(): Store {
  const STORAGE_KEY = 'beep:sessions';

  const read = (): StoredSession[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as StoredSession[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const write = (sessions: StoredSession[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  };

  const upsert = (token: string, eventCode: string, answers: QuizAnswers) => {
    const sessions = read().filter((session) => session.token !== token);
    sessions.push({ token, eventCode, answers, updatedAt: Date.now() });
    write(sessions);
  };

  const findByToken = (token: string) => read().find((session) => session.token === token) ?? null;

  const statsForEvent = (eventCode: string): Stats => {
    const sessions = read().filter((session) => session.eventCode === eventCode);
    const colors: Stats['colors'] = { green: 0, yellow: 0, red: 0 };

    if (sessions.length < 2) {
      return { participants: sessions.length, colors };
    }

    let scoreAccumulator = 0;
    let comparisonCount = 0;

    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const result: MatchResult = match(sessions[i].answers, sessions[j].answers);
        colors[result.color] += 1;
        scoreAccumulator += result.score;
        comparisonCount += 1;
      }
    }

    return {
      participants: sessions.length,
      avgScore: comparisonCount > 0 ? scoreAccumulator / comparisonCount : undefined,
      colors,
    };
  };

  return {
    async saveSession(token, eventCode, answers) {
      upsert(token, eventCode, answers);
    },
    async getPeerAnswers(token) {
      const session = findByToken(token);
      return session?.answers ?? null;
    },
    async getStats(eventCode) {
      return statsForEvent(eventCode);
    },
  };
}

function createHttpStore(baseUrl: string): Store {
  const json = async (response: Response) => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  return {
    async saveSession(token, eventCode, answers) {
      await fetch(`${baseUrl}/api/sessions/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, eventCode, answers }),
      }).then(json);
    },
    async getPeerAnswers(token) {
      const data = await fetch(`${baseUrl}/api/sessions/${encodeURIComponent(token)}`).then(json);
      return data?.answers ?? null;
    },
    async getStats(eventCode) {
      const url = new URL(`${baseUrl}/api/stats`);
      url.searchParams.set('eventCode', eventCode);
      return fetch(url.toString()).then(json);
    },
  };
}
