import { z } from 'zod';

export const calculatorSettingsSchema = z.object({
  id: z.string(),
  calculatorId: z.string(),
  name: z.string(),
  language: z.enum(['ru', 'en', 'kz']),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CalculatorSettings = z.infer<typeof calculatorSettingsSchema>;
