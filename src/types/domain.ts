import { z } from 'zod';

export const ACCENTS = ['#9a8fc0', '#8a9ac0', '#c08a9a', '#7fa0a0'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const worrySchema = z.object({ id: z.string(), txt: z.string(), at: z.number() });
export type Worry = z.infer<typeof worrySchema>;

export const settingsSchema = z.object({
  windowTime: z.string().regex(/^\d{1,2}:\d{2}$/),
  windowMin: z.number().int().min(5).max(20),
  accent: accentSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  worries: z.array(worrySchema),
});
export type PersistedState = z.infer<typeof persistedStateSchema>;
