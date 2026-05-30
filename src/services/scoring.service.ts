import { geminiModel } from "../config/gemini";
import { ApiError } from "../utils/api-error";

export interface ScoreBreakdown {
  score: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  keywordScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  summary: string;
}

interface ScoreInput {
  jdTitle: string;
  jdContent: string;
  jdRequiredSkills: string[];
  jdMinExperience?: number | null;
  jdEducation?: string | null;
  resumeText: string;
  candidateName?: string | null;
}

const SYSTEM_INSTRUCTION = `You are an expert technical recruiter. Score how well a resume matches a job description.

Return STRICT JSON ONLY with this exact shape:
{
  "score": 0-100,
  "skillsScore": 0-100,
  "experienceScore": 0-100,
  "educationScore": 0-100,
  "keywordScore": 0-100,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "summary": "2-3 sentence reasoning"
}

Rules:
- "score" is the weighted overall fit: skills 40%, experience 30%, education 15%, keywords 15%.
- Be objective and conservative. A perfect 100 requires every required skill present AND experience/education exceeding the JD.
- matchingSkills: skills explicitly demonstrated in the resume that the JD requires.
- missingSkills: required skills from the JD that the resume does NOT show.
- summary: short, factual; do not invent skills or experience.`;

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "\n...[truncated]" : text;
}

function buildPrompt(input: ScoreInput): string {
  return `JOB DESCRIPTION
Title: ${input.jdTitle}
Required skills: ${input.jdRequiredSkills.join(", ") || "(not explicitly listed)"}
Minimum experience (years): ${input.jdMinExperience ?? "not specified"}
Education: ${input.jdEducation ?? "not specified"}

JD Content:
${truncate(input.jdContent, 4000)}

CANDIDATE RESUME${input.candidateName ? ` (${input.candidateName})` : ""}:
${truncate(input.resumeText, 8000)}

Return the JSON now.`;
}

function clamp(n: unknown, fallback = 0): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim());
}

export async function scoreResumeAgainstJd(input: ScoreInput): Promise<ScoreBreakdown> {
  const prompt = buildPrompt(input);

  let rawText: string;
  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    rawText = result.response.text();
  } catch (err: any) {
    throw new ApiError(502, `Gemini API call failed: ${err?.message ?? "unknown"}`);
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) throw new ApiError(502, "Gemini returned non-JSON response");
    parsed = JSON.parse(match[0]);
  }

  return {
    score: clamp(parsed.score),
    skillsScore: clamp(parsed.skillsScore),
    experienceScore: clamp(parsed.experienceScore),
    educationScore: clamp(parsed.educationScore),
    keywordScore: clamp(parsed.keywordScore),
    matchingSkills: toStringArray(parsed.matchingSkills),
    missingSkills: toStringArray(parsed.missingSkills),
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
  };
}
