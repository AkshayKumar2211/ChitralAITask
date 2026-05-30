import { prisma } from "../../config/prisma";
import { parseResumeBuffer } from "../../services/file-parser.service";
import {
  uploadBuffer,
  deleteFile,
} from "../../services/cloudinary.service";
import {
  extractCandidateName,
  extractEmail,
  extractPhone,
} from "../../utils/text-extract";
import { ApiError } from "../../utils/api-error";
import type { ListResumesQuery, UpdateResumeInput } from "./resume.validation";

export async function ingestResume(file: Express.Multer.File) {
  const { text, fileType } = await parseResumeBuffer(file.buffer, file.mimetype);

  if (!text || text.length < 30) {
    throw new ApiError(400, `Could not extract readable text from ${file.originalname}`);
  }

  const upload = await uploadBuffer(file.buffer, file.originalname);

  return prisma.resume.create({
    data: {
      candidateName: extractCandidateName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      fileUrl: upload.url,
      filePublicId: upload.publicId,
      fileType,
      fileSizeBytes: upload.bytes,
      rawText: text,
    },
  });
}

export async function ingestResumes(files: Express.Multer.File[]) {
  const results = await Promise.allSettled(files.map(ingestResume));
  return results.map((r, i) => ({
    file: files[i].originalname,
    ok: r.status === "fulfilled",
    resume: r.status === "fulfilled" ? r.value : undefined,
    error: r.status === "rejected" ? (r.reason as Error).message : undefined,
  }));
}

export async function listResumes(q: ListResumesQuery) {
  const where = q.search
    ? {
        OR: [
          { candidateName: { contains: q.search, mode: "insensitive" as const } },
          { email: { contains: q.search, mode: "insensitive" as const } },
          { rawText: { contains: q.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.resume.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      select: {
        id: true,
        candidateName: true,
        email: true,
        phone: true,
        fileUrl: true,
        fileType: true,
        fileSizeBytes: true,
        createdAt: true,
      },
    }),
    prisma.resume.count({ where }),
  ]);

  return { items, total, page: q.page, limit: q.limit };
}

export async function getResume(id: string) {
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume) throw new ApiError(404, "Resume not found");
  return resume;
}

export async function updateResume(id: string, data: UpdateResumeInput) {
  await getResume(id);
  return prisma.resume.update({ where: { id }, data });
}

export async function deleteResume(id: string) {
  const resume = await getResume(id);
  await deleteFile(resume.filePublicId).catch(() => undefined);
  await prisma.resume.delete({ where: { id } });
  return { id };
}
