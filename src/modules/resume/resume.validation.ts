import { z } from "zod";

export const listResumesQuery = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const resumeIdParam = z.object({
  id: z.string().min(1),
});

export const updateResumeSchema = z.object({
  candidateName: z.string().trim().min(1).max(200).nullable().optional(),
  email: z.email().nullable().optional(),
  phone: z.string().trim().min(3).max(40).nullable().optional(),
});

export type ListResumesQuery = z.infer<typeof listResumesQuery>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
