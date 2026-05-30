import { z } from "zod";

export const analyzeBody = z.object({
  resumeIds: z.array(z.string().min(1)).optional(),
  concurrency: z.number().int().min(1).max(10).default(3).optional(),
  rescore: z.boolean().default(false).optional(),
});

export const resultsQuery = z.object({
  search: z.string().trim().optional(),
  sortBy: z.enum(["score", "rank", "createdAt"]).default("score"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const exportQuery = z.object({
  format: z.enum(["csv"]).default("csv"),
});

export const jdIdParam = z.object({
  jdId: z.string().min(1),
});

export const scoreIdParam = z.object({
  id: z.string().min(1),
});

const score0to100 = z.number().int().min(0).max(100);

export const updateScoreSchema = z.object({
  score: score0to100.optional(),
  skillsScore: score0to100.nullable().optional(),
  experienceScore: score0to100.nullable().optional(),
  educationScore: score0to100.nullable().optional(),
  keywordScore: score0to100.nullable().optional(),
  matchingSkills: z.array(z.string().trim().min(1)).optional(),
  missingSkills: z.array(z.string().trim().min(1)).optional(),
  summary: z.string().trim().nullable().optional(),
});

export type AnalyzeBody = z.infer<typeof analyzeBody>;
export type ResultsQuery = z.infer<typeof resultsQuery>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
