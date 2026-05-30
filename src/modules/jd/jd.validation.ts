import { z } from "zod";

export const createJdSchema = z.object({
  title: z.string().trim().min(2).max(200),
  content: z.string().trim().min(20),
  requiredSkills: z.array(z.string().trim().min(1)).default([]),
  minExperience: z.number().int().min(0).max(60).optional(),
  education: z.string().trim().optional(),
});

export const updateJdSchema = createJdSchema.partial();

export const listJdsQuery = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const jdIdParam = z.object({
  id: z.string().min(1),
});

export type CreateJdInput = z.infer<typeof createJdSchema>;
export type UpdateJdInput = z.infer<typeof updateJdSchema>;
export type ListJdsQuery = z.infer<typeof listJdsQuery>;
