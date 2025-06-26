import { z } from 'zod';
import { optionItemSchema } from './options';

export const answerSchema = z.union([
  optionItemSchema.shape.id,
  z.array(optionItemSchema.shape.id),
  z.number(),
  z.boolean(),
  //
]);

export type AnswerType = z.infer<typeof answerSchema>;
