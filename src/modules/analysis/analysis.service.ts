import { prisma } from "../../config/prisma";
import { scoreResumeAgainstJd } from "../../services/scoring.service";
import { ApiError } from "../../utils/api-error";
import type {
  AnalyzeBody,
  ResultsQuery,
  UpdateScoreInput,
} from "./analysis.validation";

const SCORE_INCLUDE = {
  resume: {
    select: {
      id: true,
      candidateName: true,
      email: true,
      phone: true,
      fileUrl: true,
      fileType: true,
    },
  },
} as const;

async function runWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      try {
        results[i] = { status: "fulfilled", value: await worker(items[i]) };
      } catch (reason) {
        results[i] = { status: "rejected", reason };
      }
    }
  });

  await Promise.all(runners);
  return results;
}

export async function analyzeJob(jdId: string, body: AnalyzeBody) {
  const jd = await prisma.jobDescription.findUnique({ where: { id: jdId } });
  if (!jd) throw new ApiError(404, "Job description not found");

  const resumeWhere = body.resumeIds?.length ? { id: { in: body.resumeIds } } : {};
  const resumes = await prisma.resume.findMany({ where: resumeWhere });
  if (resumes.length === 0) throw new ApiError(400, "No resumes to analyze");

  let targets = resumes;
  if (!body.rescore) {
    const existing = await prisma.scoreResult.findMany({
      where: { jobDescriptionId: jdId, resumeId: { in: resumes.map((r) => r.id) } },
      select: { resumeId: true },
    });
    const scored = new Set(existing.map((e) => e.resumeId));
    targets = resumes.filter((r) => !scored.has(r.id));
  }

  const concurrency = body.concurrency ?? 3;

  const settled = await runWithConcurrency(targets, concurrency, async (resume) => {
    const breakdown = await scoreResumeAgainstJd({
      jdTitle: jd.title,
      jdContent: jd.content,
      jdRequiredSkills: jd.requiredSkills,
      jdMinExperience: jd.minExperience,
      jdEducation: jd.education,
      resumeText: resume.rawText,
      candidateName: resume.candidateName,
    });

    return prisma.scoreResult.upsert({
      where: {
        resumeId_jobDescriptionId: {
          resumeId: resume.id,
          jobDescriptionId: jdId,
        },
      },
      create: { ...breakdown, resumeId: resume.id, jobDescriptionId: jdId },
      update: { ...breakdown },
    });
  });

  await reassignRanks(jdId);

  const errors = settled
    .map((s, i) => (s.status === "rejected" ? { resumeId: targets[i].id, error: String(s.reason) } : null))
    .filter(Boolean);

  return {
    analyzed: settled.filter((s) => s.status === "fulfilled").length,
    skipped: resumes.length - targets.length,
    errors,
  };
}

async function reassignRanks(jdId: string) {
  const scores = await prisma.scoreResult.findMany({
    where: { jobDescriptionId: jdId },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  await prisma.$transaction(
    scores.map((s, i) =>
      prisma.scoreResult.update({ where: { id: s.id }, data: { rank: i + 1 } })
    )
  );
}

export async function getResults(jdId: string, q: ResultsQuery) {
  const jd = await prisma.jobDescription.findUnique({
    where: { id: jdId },
    select: { id: true, title: true },
  });
  if (!jd) throw new ApiError(404, "Job description not found");

  const where: any = { jobDescriptionId: jdId };
  if (q.search) {
    where.resume = {
      OR: [
        { candidateName: { contains: q.search, mode: "insensitive" } },
        { email: { contains: q.search, mode: "insensitive" } },
      ],
    };
  }

  const [items, total] = await Promise.all([
    prisma.scoreResult.findMany({
      where,
      orderBy: { [q.sortBy]: q.order },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      include: {
        resume: {
          select: {
            id: true,
            candidateName: true,
            email: true,
            phone: true,
            fileUrl: true,
            fileType: true,
          },
        },
      },
    }),
    prisma.scoreResult.count({ where }),
  ]);

  return { jd, items, total, page: q.page, limit: q.limit };
}

export async function getScoreResult(id: string) {
  const result = await prisma.scoreResult.findUnique({
    where: { id },
    include: SCORE_INCLUDE,
  });
  if (!result) throw new ApiError(404, "Score result not found");
  return result;
}

export async function updateScoreResult(id: string, data: UpdateScoreInput) {
  const existing = await prisma.scoreResult.findUnique({
    where: { id },
    select: { id: true, jobDescriptionId: true, score: true },
  });
  if (!existing) throw new ApiError(404, "Score result not found");

  const updated = await prisma.scoreResult.update({
    where: { id },
    data,
    include: SCORE_INCLUDE,
  });

  if (data.score !== undefined && data.score !== existing.score) {
    await reassignRanks(existing.jobDescriptionId);
  }
  return updated;
}

export async function deleteScoreResult(id: string) {
  const existing = await prisma.scoreResult.findUnique({
    where: { id },
    select: { id: true, jobDescriptionId: true },
  });
  if (!existing) throw new ApiError(404, "Score result not found");

  await prisma.scoreResult.delete({ where: { id } });
  await reassignRanks(existing.jobDescriptionId);
  return { id };
}

export async function exportResultsCsv(jdId: string): Promise<string> {
  const { items } = await getResults(jdId, {
    sortBy: "score",
    order: "desc",
    page: 1,
    limit: 10000,
  });

  const header = [
    "rank",
    "score",
    "candidateName",
    "email",
    "phone",
    "matchingSkills",
    "missingSkills",
    "skillsScore",
    "experienceScore",
    "educationScore",
    "keywordScore",
    "fileUrl",
    "summary",
  ];

  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const rows = items.map((r) =>
    [
      r.rank ?? "",
      r.score,
      r.resume.candidateName ?? "",
      r.resume.email ?? "",
      r.resume.phone ?? "",
      r.matchingSkills.join("; "),
      r.missingSkills.join("; "),
      r.skillsScore ?? "",
      r.experienceScore ?? "",
      r.educationScore ?? "",
      r.keywordScore ?? "",
      r.resume.fileUrl,
      r.summary ?? "",
    ]
      .map(escape)
      .join(",")
  );

  return [header.join(","), ...rows].join("\n");
}
