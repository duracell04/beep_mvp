// src/api/store.ts
export type Stats = {
  participants: number;
  avgScore: number;
  colors: { green: number; yellow: number; red: number };
};

export interface Store {
  saveSession(token: string, eventCode: string, answers: Record<string, unknown>): Promise<void>;
  getStats(eventCode?: string): Promise<Stats>;
  getPeerAnswers(token: string): Promise<Record<string, unknown> | null>;
}

const backend = import.meta.env.VITE_BACKEND_URL as string | undefined;
export const store: Store = backend ? httpStore(backend) : localStore();

/* ---------- Local (no backend, reliable for dev) ---------- */
function localStore(): Store {
  const KEY = 'beep:sessions';
  const read = (): Array<{ token: string; event_code?: string; answers: Record<string, unknown> }> =>
    JSON.parse(localStorage.getItem(KEY) ?? '[]');
  const write = (rows: unknown[]) => localStorage.setItem(KEY, JSON.stringify(rows));

  return {
    async saveSession(token, eventCode, answers) {
      const rows = read().filter(r => r.token !== token);
      rows.push({ token, event_code: eventCode, answers });
      write(rows);
    },
    async getStats(eventCode) {
      const rows = read().filter(r => !eventCode || r.event_code === eventCode);
      const colors: Stats['colors'] = { green: 0, yellow: 0, red: 0 };
      let scoreSum = 0, count = 0;

      for (let i = 0; i < rows.length; i++) {
        for (let j = i + 1; j < rows.length; j++) {
          const { score, color } = compute(rows[i].answers, rows[j].answers);
          scoreSum += score; count++; colors[color]++;
        }
      }
      return { participants: rows.length, avgScore: count ? scoreSum / count : 0, colors };
    },
    async getPeerAnswers(token) {
      const row = read().find(r => r.token === token);
      return row?.answers ?? null;
    }
  };
}

/* ---------- HTTP (simple REST API) ---------- */
function httpStore(base: string): Store {
  const j = (r: Response) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status} ${r.statusText}`)));

  return {
    async saveSession(token, eventCode, answers) {
      await fetch(`${base}/api/sessions/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, eventCode, answers })
      }).then(j);
    },
    async getStats(eventCode) {
      const url = new URL(`${base}/api/stats`);
      if (eventCode) url.searchParams.set('eventCode', eventCode);
      return fetch(url).then(j);
    },
    async getPeerAnswers(token) {
      const res = await fetch(`${base}/api/sessions/${encodeURIComponent(token)}`).then(j);
      return res?.answers ?? null;
    },
  };
}

/* local deterministic similarity (not tied to matcher tests) */
function compute(a: Record<string, unknown>, b: Record<string, unknown>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let same = 0, total = 0;
  for (const k of keys) {
    if (k in a && k in b) { total++; if (a[k] === b[k]) same++; }
  }
  const score = total ? same / total : 0;
  const color: 'green' | 'yellow' | 'red' = score >= 0.8 ? 'green' : score >= 0.5 ? 'yellow' : 'red';
  return { score, color } as const;
}
