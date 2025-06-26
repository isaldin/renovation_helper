import { z } from 'zod';

export const optionItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().optional(),
  pricePerM2: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export type OptionItem = z.infer<typeof optionItemSchema>;

export const optionListSchema = z.object({
  id: z.string(),
  options: z.array(optionItemSchema),
});
export type OptionList = z.infer<typeof optionListSchema>;
