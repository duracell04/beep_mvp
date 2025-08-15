import { z } from 'zod';

export const QrPayload = z.object({
  event: z.string().regex(/^\d{4}$/),
  token: z.string().uuid(),
  ts: z.number().int().positive(),
  exp: z.number().int().positive(),
});

export type QrPayloadT = z.infer<typeof QrPayload>;
