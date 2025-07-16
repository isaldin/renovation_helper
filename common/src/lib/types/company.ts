import { z } from 'zod';

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string().optional(),
  website: z.string().optional(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Company = z.infer<typeof companySchema>;