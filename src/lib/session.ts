import { z } from 'zod';
import type { QuizAnswers } from '@/data/questions';

const qrPayloadSchema = z.object({
  t: z.string(),
  e: z.string(),
  v: z.literal(1),
  ts: z.number().optional(),
});

export type QrPayload = z.infer<typeof qrPayloadSchema>;

export const generateToken = () =>
  Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);

export const buildQrPayload = (token: string, eventCode: string): string =>
  JSON.stringify({ t: token, e: eventCode, v: 1 as const, ts: Date.now() });

export const parseQrPayload = (value: string): QrPayload | null => {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    const result = qrPayloadSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

export const withEventCode = (answers: QuizAnswers, eventCode: string): QuizAnswers => ({
  ...answers,
  eventCode,
});
