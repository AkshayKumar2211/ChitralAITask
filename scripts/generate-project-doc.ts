import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

const OUTPUT_PATH = path.resolve(__dirname, "../../docs/chitralai-project-overview.pdf");

const COLOR = {
  ink: "#0a0a0a",
  muted: "#555",
  faint: "#888",
  rule: "#dddddd",
  accent: "#0f4c81",
  codeBg: "#f4f4f5",
  codeBorder: "#e4e4e7",
};

// ----- helpers --------------------------------------------------------------

function h1(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.8);
  doc.font("Helvetica-Bold").fontSize(18).fillColor(COLOR.ink).text(text);
  hr(doc, COLOR.accent, 1.2);
  doc.moveDown(0.4);
  doc.fillColor(COLOR.ink);
}

function h2(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(12.5).fillColor(COLOR.ink).text(text);
  doc.moveDown(0.2);
}

function body(doc: PDFKit.PDFDocument, text: string) {
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLOR.ink)
    .text(text, { align: "left", lineGap: 1.5 });
  doc.moveDown(0.2);
}

function bullet(doc: PDFKit.PDFDocument, items: string[]) {
  doc.font("Helvetica").fontSize(10).fillColor(COLOR.ink);
  items.forEach((item) => {
    doc.text(`•  ${item}`, { lineGap: 1.5, indent: 0 });
  });
  doc.moveDown(0.2);
}

function hr(doc: PDFKit.PDFDocument, color = COLOR.rule, width = 0.5) {
  const y = doc.y + 2;
  doc
    .strokeColor(color)
    .lineWidth(width)
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .stroke();
  doc.moveDown(0.5);
  doc.fillColor(COLOR.ink);
}

function code(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.2);
  const x = doc.page.margins.left;
  const w = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const padding = 8;

  // measure
  doc.font("Courier").fontSize(9);
  const textHeight = doc.heightOfString(text, { width: w - padding * 2 });
  const h = textHeight + padding * 2;

  // page break if we'd overflow
  if (doc.y + h > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }

  const y = doc.y;
  doc
    .rect(x, y, w, h)
    .fillAndStroke(COLOR.codeBg, COLOR.codeBorder);

  doc
    .fillColor(COLOR.ink)
    .font("Courier")
    .fontSize(9)
    .text(text, x + padding, y + padding, { width: w - padding * 2 });

  doc.y = y + h + 6;
  doc.fillColor(COLOR.ink);
}

function kv(doc: PDFKit.PDFDocument, rows: [string, string][]) {
  const labelWidth = 150;
  doc.font("Helvetica").fontSize(10);

  rows.forEach(([k, v]) => {
    const startY = doc.y;
    doc.font("Helvetica-Bold").fillColor(COLOR.muted).text(k, { width: labelWidth, continued: false });
    const labelEndY = doc.y;
    doc.y = startY;
    doc
      .font("Helvetica")
      .fillColor(COLOR.ink)
      .text(v, doc.page.margins.left + labelWidth, startY, {
        width: doc.page.width - doc.page.margins.right - doc.page.margins.left - labelWidth,
        lineGap: 1.5,
      });
    doc.y = Math.max(doc.y, labelEndY) + 4;
  });
  doc.moveDown(0.2);
}

function qa(doc: PDFKit.PDFDocument, q: string, a: string) {
  doc.moveDown(0.3);
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(COLOR.accent).text(`Q. ${q}`);
  doc.moveDown(0.1);
  doc.font("Helvetica").fontSize(10).fillColor(COLOR.ink).text(`A. ${a}`, { lineGap: 1.5 });
}

function footer(doc: PDFKit.PDFDocument) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    const bottom = doc.page.height - 32;
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLOR.faint)
      .text(
        `Chitralai · Resume Screening & Candidate Ranking`,
        doc.page.margins.left,
        bottom,
        { align: "left", lineBreak: false }
      );
    doc.text(`${i + 1} / ${range.count}`, doc.page.margins.left, bottom, {
      align: "right",
      lineBreak: false,
    });
  }
}

// ----- document -------------------------------------------------------------

function build(doc: PDFKit.PDFDocument) {
  // ---------- cover ----------
  doc.fontSize(48).font("Helvetica-Bold").fillColor(COLOR.accent).text("Chitralai", { align: "left" });
  doc.moveDown(0.2);
  doc
    .fontSize(16)
    .font("Helvetica")
    .fillColor(COLOR.muted)
    .text("AI-Powered Resume Screening & Candidate Ranking", { align: "left" });
  doc.moveDown(1.2);

  hr(doc, COLOR.accent, 1.5);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(COLOR.ink)
    .text(
      "A full-stack web application that automates the first pass of HR screening: HR uploads candidate resumes, defines a job description, and receives a ranked list of candidates with match scores, key matching skills, and skill gaps. Built end-to-end in TypeScript with Express and Next.js, with semantic scoring powered by Google Gemini.",
      { align: "justify", lineGap: 2 }
    );

  doc.moveDown(1);
  h2(doc, "Tech Stack at a Glance");
  bullet(doc, [
    "Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, SWR",
    "Backend: Node.js 20+, Express 5, TypeScript, Prisma 7",
    "Database: PostgreSQL (hosted Prisma Postgres; any Postgres ≥ 14 works)",
    "AI: Google Gemini 2.5 Flash (JSON response mode, temperature 0.2)",
    "File storage: Cloudinary",
    "Parsers: pdf-parse v2 (PDF), mammoth (DOCX), word-extractor (legacy DOC)",
    "Validation: Zod",
  ]);

  h2(doc, "What this document covers");
  bullet(doc, [
    "Problem statement, user workflow, and architecture",
    "Data model with rationale behind every key column / constraint",
    "Detailed scoring approach — the technical centrepiece",
    "Request flow for the two most interesting paths (upload + analyze)",
    "API surface and frontend route map",
    "Trade-offs, assumptions, and what would change at production scale",
    "Likely interview questions with concise, defensible answers",
  ]);

  // ---------- problem ----------
  doc.addPage();
  h1(doc, "1. Problem Statement");
  body(
    doc,
    "A recruiter typically spends 6–8 seconds skimming each resume on a first pass. For a single role with 200 applicants, that is 20+ minutes of pure triage before any deeper review can begin — and the triage is inconsistent across recruiters and easily biased. Existing applicant tracking systems either rely on brittle keyword matching (misses synonyms and inferred skills) or hide behind enterprise pricing."
  );

  h2(doc, "Design goals");
  bullet(doc, [
    "Reduce time-to-shortlist by automating the first pass",
    "Produce objective, consistent, repeatable scoring per candidate per JD",
    "Surface matching and missing skills explicitly so recruiters can sanity-check",
    "Stay advisory — results inform the recruiter, they never gate the human decision",
    "Single-tenant demo scope (no auth) to keep the moving parts focused on the screening logic",
  ]);

  h2(doc, "User workflow");
  bullet(doc, [
    "Upload resumes (single or batch; PDF, DOC, DOCX)",
    "Define the JD (type manually with structured fields, or upload a JD file)",
    "Click Run Analysis — semantic scoring runs against every uploaded resume",
    "Review the ranked dashboard with score, matching skills, missing skills, AI summary",
    "Export CSV, sort, search, or click into a specific candidate",
  ]);

  // ---------- architecture ----------
  doc.addPage();
  h1(doc, "2. Architecture");

  body(
    doc,
    "Two-tier with clear boundaries — the frontend and backend deploy independently. The backend talks to three external services: Postgres for state, Cloudinary for file blobs, and Gemini for scoring."
  );

  code(
    doc,
    `Next.js frontend  ───── HTTPS (JSON) ─────►  Express + TS backend
                                                ├──► PostgreSQL (Prisma 7)
                                                ├──► Cloudinary (file storage)
                                                └──► Google Gemini API (scoring)`
  );

  h2(doc, "Why this shape");
  bullet(doc, [
    "Independent deploys — Vercel for the frontend, Render / Railway for the backend",
    "In-memory file upload — multer buffers files in RAM so we parse and stream to Cloudinary in one pass, no second download",
    "Prisma 7 with the new prisma-client generator — outputs typed client into src/generated/prisma; works with pg adapter at runtime",
    "Cloudinary returns a public URL, so the frontend can preview / download resumes without proxying through our API",
    "Gemini handles the semantic heavy lifting — we stay focused on orchestration, persistence, and UX",
  ]);

  h2(doc, "Folder layout");
  code(
    doc,
    `chitralai/
├── chitralaibackend/
│   ├── prisma/schema.prisma          # JobDescription, Resume, ScoreResult
│   └── src/
│       ├── server.ts, app.ts
│       ├── config/                   # env, prisma, cloudinary, gemini
│       ├── middlewares/              # validate, upload, error
│       ├── modules/                  # resume / jd / analysis (each: routes, controller, service, validation)
│       ├── services/                 # file-parser, cloudinary, scoring
│       ├── routes/index.ts           # /api/v1 router
│       └── utils/
└── chitralaifrontend/
    └── src/
        ├── app/                      # jds, jds/new, jds/[id]/edit, resumes, resumes/[id]/edit, analyze/[jdId]
        ├── components/               # Button, Header, ScoreBadge, EmptyState
        └── lib/                      # api client, types`
  );

  // ---------- data model ----------
  doc.addPage();
  h1(doc, "3. Data Model");

  body(
    doc,
    "Three core tables. ScoreResult is a join table with attributes — chosen over embedding the score on Resume because a resume can be scored against many JDs, and JDs can be re-scored without losing history."
  );

  h2(doc, "JobDescription");
  bullet(doc, [
    "id (cuid), title, content",
    "requiredSkills: string[] — structured skill list (Postgres array)",
    "minExperience: int?, education: string?",
    "source: MANUAL | UPLOAD enum",
    "fileUrl, filePublicId — populated when uploaded as a file",
  ]);

  h2(doc, "Resume");
  bullet(doc, [
    "id, candidateName, email, phone (regex-extracted from the resume text)",
    "fileUrl, filePublicId, fileType (PDF | DOC | DOCX enum), fileSizeBytes",
    "rawText — full extracted text, used as Gemini input",
    "parsedSkills, parsedExperience, parsedEducation — reserved for future structured extraction",
    "Indexed on (email) and (createdAt)",
  ]);

  h2(doc, "ScoreResult (the N:M join with metadata)");
  bullet(doc, [
    "score (0–100), plus per-factor sub-scores (skillsScore, experienceScore, educationScore, keywordScore)",
    "matchingSkills[], missingSkills[]",
    "summary — short AI-generated reasoning",
    "rank — recomputed in a transaction after every analysis batch",
    "Unique constraint on (resumeId, jobDescriptionId) — enforces one score per (resume, JD) pair",
    "Composite index on (jobDescriptionId, score) — supports fast leaderboard queries",
    "Cascade delete from both Resume and JobDescription",
  ]);

  h2(doc, "Design rationale, key decisions");
  bullet(doc, [
    "Cuid PKs — collision-safe distributed IDs, URL-friendly, sortable enough for our use case",
    "Postgres native arrays for skills — avoids a separate skills table that we'd query for read-only summary data; Prisma supports them first-class",
    "rawText kept in DB — once parsed, never re-fetch from Cloudinary just to score again; storage is cheap, latency matters",
    "Optional FKs everywhere — relationships are advisory in a demo, but the unique + cascade constraints on ScoreResult enforce real integrity where it counts",
  ]);

  // ---------- scoring ----------
  doc.addPage();
  h1(doc, "4. Scoring Approach (technical heart)");

  h2(doc, "Why AI, not keyword matching?");
  bullet(doc, [
    "Keyword matching misses synonyms: 'Postgres' vs 'PostgreSQL', 'JS' vs 'JavaScript'",
    "Cannot infer skills from project descriptions (e.g. 'shipped onboarding flow on Next.js' implies React)",
    "Cannot weight experience context (a junior with the keyword is not a senior with the skill)",
    "Gemini handles all three naturally; cost is latency (~3–8s/resume) and an external dependency",
  ]);

  h2(doc, "Implementation choices");
  kv(doc, [
    ["Model", "Google Gemini 2.5 Flash (free tier, 15 RPM / 1500 RPD)"],
    ["Response mode", "responseMimeType: 'application/json' — guaranteed parseable JSON"],
    ["Temperature", "0.2 — low for deterministic, repeatable scores"],
    ["System prompt", "Fixes the JSON shape, defines weighting, prohibits skill invention"],
    ["Concurrency", "Pool of 3 in-process workers — avoids rate limits, isolates failures"],
    ["Truncation", "JD content capped at 4k chars, resume at 8k chars — keeps prompt small + cost low"],
  ]);

  h2(doc, "Overall score formula");
  code(
    doc,
    `overall = 0.40 * skillsScore
        + 0.30 * experienceScore
        + 0.15 * educationScore
        + 0.15 * keywordScore

(All sub-scores 0–100, weighted average rounded to int.)`
  );

  h2(doc, "Defensive output parsing");
  bullet(doc, [
    "Primary parse: JSON.parse on Gemini's response body",
    "Fallback: regex-extract the outermost {...} from the raw text and parse that",
    "Numeric outputs clamped to [0, 100] via a clamp() helper",
    "String arrays sanitised — only non-empty strings retained",
    "Bad output for one resume never crashes the batch — failures are isolated and surfaced per-resume in the analyze response",
  ]);

  h2(doc, "Ranking");
  bullet(doc, [
    "After all upserts finish, reassignRanks() runs in a single Prisma transaction",
    "Order: score desc, then createdAt asc as tie-breaker",
    "Recomputed on every analysis batch and on every manual score edit / delete — the leaderboard is always consistent",
  ]);

  // ---------- request flow ----------
  doc.addPage();
  h1(doc, "5. Request Flows");

  h2(doc, "POST /api/v1/analysis/:jdId");
  code(
    doc,
    `Validate jdId / body
    │
    ├─→ Load JD from Postgres (404 if missing)
    │
    ├─→ Load resumes (filter by resumeIds[] if provided)
    │   Skip already-scored resumes unless rescore: true
    │
    ├─→ Concurrency pool (size 3):
    │     ├─→ Build prompt (truncate JD + resume to budgets)
    │     ├─→ Gemini.generateContent (JSON mode)
    │     ├─→ Parse + sanitize (clamp / defensive fallback)
    │     └─→ Prisma.scoreResult.upsert  (unique on resume+jd)
    │
    ├─→ reassignRanks(jdId) inside a transaction
    │
    └─→ Return { analyzed, skipped, errors[] }`
  );

  h2(doc, "POST /api/v1/resumes (multipart)");
  code(
    doc,
    `multer.memoryStorage() — RAM buffer, MAX_FILE_SIZE_MB cap
    │
    ├─→ Detect file type from mimetype
    │
    ├─→ Extract text:
    │     PDF  → pdf-parse v2 (PDFParse class, getText())
    │     DOCX → mammoth.extractRawText({ buffer })
    │     DOC  → word-extractor (handles legacy OLE binary)
    │
    ├─→ Regex extract candidateName / email / phone from the top of the text
    │
    ├─→ cloudinary.uploader.upload_stream(buffer) → secure URL
    │
    └─→ prisma.resume.create({ ...metadata, rawText, fileUrl, filePublicId })`
  );

  body(
    doc,
    "Why memory storage: Cloudinary's stream upload is async; keeping the buffer in RAM lets us parse and upload in a single pass without a second network round trip."
  );

  // ---------- API + frontend ----------
  doc.addPage();
  h1(doc, "6. API Surface & Frontend Routes");

  h2(doc, "Resumes — full CRUD");
  bullet(doc, [
    "POST   /resumes           bulk upload (1–50 files)",
    "GET    /resumes           paginated, searchable list",
    "GET    /resumes/:id       full record incl. rawText",
    "PATCH  /resumes/:id       correct extracted name / email / phone",
    "DELETE /resumes/:id       removes from Cloudinary + DB",
  ]);

  h2(doc, "Job Descriptions — full CRUD");
  bullet(doc, [
    "POST   /jds               manual entry",
    "POST   /jds/upload        from PDF / DOCX",
    "GET    /jds, GET /jds/:id",
    "PUT    /jds/:id           full update",
    "DELETE /jds/:id",
  ]);

  h2(doc, "Analysis — batch + per-result CRUD");
  bullet(doc, [
    "POST   /analysis/:jdId            run Gemini scoring against resumes",
    "GET    /analysis/:jdId/results    ranked leaderboard (sort, search, paginate)",
    "GET    /analysis/:jdId/export     CSV download",
    "GET    /analysis/results/:id      one score detail",
    "PATCH  /analysis/results/:id      manual override (reassigns ranks if score changes)",
    "DELETE /analysis/results/:id      remove from leaderboard (reassigns ranks)",
  ]);

  h2(doc, "Frontend page map");
  bullet(doc, [
    "/jds                       list with Analyze / Edit / Delete actions",
    "/jds/new                   create form (manual + upload tabs)",
    "/jds/[id]/edit             pre-filled edit form",
    "/resumes                   bulk upload + searchable list",
    "/resumes/[id]/edit         fix bad extractions",
    "/analyze/[jdId]            run analysis + ranked table + sort / search / export / per-row delete",
  ]);

  h2(doc, "Frontend implementation notes");
  bullet(doc, [
    "All pages are client components — every screen has forms / state, so server components add no value",
    "SWR for data fetching: auto-revalidates, deduplicates, easy mutation after writes",
    "Typed API client at src/lib/api.ts mirrors backend response shapes; types live in src/lib/types.ts",
    "Tailwind v4 with no UI library — fewer deps, consistent design via Button / ScoreBadge / EmptyState",
    "Score colour-coding: green ≥ 80, amber ≥ 60, red below — immediate visual signal at a glance",
    "CSV export uses fetch + blob + <a download> on the frontend so the auth header (if added later) is included",
  ]);

  // ---------- trade-offs ----------
  doc.addPage();
  h1(doc, "7. Trade-offs & Assumptions");

  kv(doc, [
    [
      "No authentication",
      "Task brief did not require it; would add JWT + per-user scoping next. The DB schema can absorb a User model + nullable userId FKs without a migration headache.",
    ],
    [
      "Synchronous analysis",
      "Simpler at MVP scale (≤ 30 resumes per batch). At 100+ resumes, would move to BullMQ + Redis with the frontend polling /results or upgrading to SSE.",
    ],
    [
      "AI over keyword scoring",
      "Higher accuracy (synonyms, inferred skills, experience context). Costs latency (~3–8s/resume) and depends on Gemini availability — mitigated by per-resume isolation and the upsert/rescore flow.",
    ],
    [
      "CSV-only export",
      "Brief said 'CSV / Excel'. CSV opens cleanly in Excel and adds zero dependencies; xlsx can be added in ~30 lines if needed.",
    ],
    [
      "Regex metadata extraction",
      "Best-effort on standard resume layouts; unusual formatting leaves fields empty. The PATCH /resumes/:id endpoint and the matching frontend edit page let users correct these.",
    ],
    [
      "Prisma Postgres for dev",
      "Convenient hosted setup; production-portable because the provider is just postgresql — any managed Postgres (Neon, Supabase, RDS, Aiven) works with no schema changes.",
    ],
    [
      "DOC support via word-extractor",
      "Parses the legacy OLE binary directly from a buffer, no temp files. Some unusual .doc layouts (very old or password-protected) may extract garbled text — workaround is convert to .docx or PDF.",
    ],
  ]);

  // ---------- improvements ----------
  doc.addPage();
  h1(doc, "8. Production Improvements (when asked 'what's next?')");

  bullet(doc, [
    "Background queue (BullMQ + Redis) for analysis — frontend polls or uses SSE for progress; analyses no longer block HTTP threads",
    "Authentication + multi-tenancy — JWT, per-user resource scoping, role-based permissions for shared org tenancy",
    "Caching — Redis for hot reads (results, JD list); SWR already caches client-side",
    "Observability — Sentry for errors; OpenTelemetry traces around Gemini calls, Cloudinary uploads, DB queries",
    "Better resume parsing — replace regex with a small trained extractor or LLM-driven structured extraction step at upload time",
    "Bias detection — flag scoring patterns correlated with name / school / location signals; surface for recruiter review",
    "Multi-language support — Gemini handles many languages natively; UI i18n is the only frontend lift",
    "Versioned audit log of score changes — every manual override stamped with who/when/why, surfaced in a candidate's history view",
    "Bulk JD upload + bulk re-analysis — re-score all candidates against a new JD with one click",
    "Webhooks — notify external ATS when a candidate crosses a score threshold",
  ]);

  // ---------- Q&A ----------
  doc.addPage();
  h1(doc, "9. Likely Interview Questions");

  qa(
    doc,
    "Why Gemini and not OpenAI?",
    "Gemini 2.5 Flash has a free tier with generous quotas (15 RPM / 1500 RPD), supports JSON response mode natively, and delivers equivalent quality for structured tasks like resume scoring. No business reason to pay for OpenAI when the free tier is sufficient for the workload. The scoring service is a thin abstraction — swapping providers is a one-file change."
  );

  qa(
    doc,
    "How would you scale this to 10k resumes per JD?",
    "Move analysis into a background queue — BullMQ + Redis is the standard pick. The leaderboard query already has a composite index on (jobDescriptionId, score). Stream progress to the frontend via SSE or WebSockets. Add Postgres read replicas to serve leaderboard reads. Concurrency stays bounded by Gemini's rate limits, so horizontal worker scaling helps until that ceiling."
  );

  qa(
    doc,
    "What if the resume PDF is actually a scanned image?",
    "pdf-parse returns empty text; the upload service throws 'Could not extract readable text from <file>'. Fix: add an OCR fallback via Tesseract.js or Google Cloud Vision when extracted text falls below a length threshold. The change is localised to file-parser.service.ts."
  );

  qa(
    doc,
    "What happens if Gemini returns malformed JSON?",
    "Defensive parsing in scoring.service.ts — primary path is JSON.parse, fallback regex-extracts {...} from the raw text and parses that. All numeric outputs clamped to [0, 100], string arrays sanitised. If both paths fail, the per-resume task is marked failed in the analyze response and the batch continues — one bad model output never breaks the whole job."
  );

  qa(
    doc,
    "How do you prevent duplicate scoring?",
    "ScoreResult has a unique constraint on (resumeId, jobDescriptionId). The service uses Prisma upsert keyed on that compound unique — re-running analysis silently no-ops unless the rescore flag is set, in which case it updates in place. Ranks recompute at the end of every batch regardless."
  );

  qa(
    doc,
    "Why is ScoreResult a separate table and not a column on Resume?",
    "A resume can be scored against many JDs over time. Embedding would either limit each resume to a single score or push into a JSONB column with no relational integrity. The separate join table gives us the unique constraint, the cascade deletes, the indexes we need for the leaderboard, and a clean place to attach per-score metadata (rank, sub-scores, summary)."
  );

  qa(
    doc,
    "Why TypeScript end-to-end?",
    "Prisma's generated types flow through services into API response shapes (lib/types.ts on the frontend). A schema change ripples into compile errors everywhere it breaks. The cost is build setup — small once configured. The payoff is catching mismatched fields and wrong nullability before they ship."
  );

  qa(
    doc,
    "How do you handle very large JDs or resumes?",
    "Both are truncated before being sent to Gemini — JD content at 4k characters, resume text at 8k. The truncation is at the prompt boundary, not at upload time — the raw text stays in the DB. For most resumes this is non-binding; for unusual ones we trade a small loss of context for predictable token cost. The truncation thresholds are constants and easy to tune."
  );

  qa(
    doc,
    "What's the biggest weakness of the current implementation?",
    "Synchronous analysis blocks the HTTP request for the duration of the Gemini calls — fine for the demo but breaks at higher load. The fix is the BullMQ queue from question 2. Second-biggest: the metadata extraction (name / email / phone) is regex-based and fails on unusual resume layouts — mitigated by the PATCH endpoint and the edit UI, but a proper structured-extraction step at upload would be better."
  );

  qa(
    doc,
    "Walk me through what happens when I click 'Run analysis'.",
    "Frontend POSTs to /api/v1/analysis/:jdId. Express validates the jdId param and body, hands off to analyzeJob in analysis.service.ts. That loads the JD, fetches all uploaded resumes, filters out ones already scored unless rescore is set, then runs them through a concurrency pool. Each resume builds a prompt, calls Gemini with JSON response mode, parses defensively, and upserts a ScoreResult row keyed on (resumeId, jobDescriptionId). After the pool drains, reassignRanks runs in a transaction. The response returns { analyzed, skipped, errors }. The frontend re-queries /results via SWR and re-renders the table."
  );
}

// ----- run ------------------------------------------------------------------

function main() {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  const doc = new PDFDocument({
    size: "A4",
    margin: 56,
    bufferPages: true,
    info: {
      Title: "Chitralai — Project Overview",
      Author: "Chitralai",
      Subject: "AI-Powered Resume Screening & Candidate Ranking",
      Keywords: "resume screening, AI, gemini, express, nextjs, postgres",
    },
  });

  const stream = fs.createWriteStream(OUTPUT_PATH);
  doc.pipe(stream);

  build(doc);
  footer(doc);

  doc.end();

  stream.on("finish", () => {
    console.log(`✓ Generated: ${OUTPUT_PATH}`);
  });
}

main();
