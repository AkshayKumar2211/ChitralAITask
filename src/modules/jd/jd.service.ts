import { prisma } from "../../config/prisma";
import { parseResumeBuffer } from "../../services/file-parser.service";
import {
  uploadBuffer,
  deleteFile,
} from "../../services/cloudinary.service";
import { ApiError } from "../../utils/api-error";
import type {
  CreateJdInput,
  UpdateJdInput,
  ListJdsQuery,
} from "./jd.validation";

export async function createJd(data: CreateJdInput) {
  return prisma.jobDescription.create({
    data: { ...data, source: "MANUAL" },
  });
}

export async function uploadJdFile(file: Express.Multer.File, title?: string) {
  const { text } = await parseResumeBuffer(file.buffer, file.mimetype);
  if (!text || text.length < 30) {
    throw new ApiError(400, "Could not extract text from the JD file");
  }
  const upload = await uploadBuffer(file.buffer, file.originalname);

  return prisma.jobDescription.create({
    data: {
      title: title?.trim() || file.originalname.replace(/\.[^.]+$/, ""),
      content: text,
      source: "UPLOAD",
      fileUrl: upload.url,
      filePublicId: upload.publicId,
    },
  });
}

export async function listJds(q: ListJdsQuery) {
  const where = q.search
    ? {
        OR: [
          { title: { contains: q.search, mode: "insensitive" as const } },
          { content: { contains: q.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.jobDescription.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
      select: {
        id: true,
        title: true,
        source: true,
        requiredSkills: true,
        minExperience: true,
        education: true,
        createdAt: true,
        _count: { select: { scores: true } },
      },
    }),
    prisma.jobDescription.count({ where }),
  ]);

  return { items, total, page: q.page, limit: q.limit };
}

export async function getJd(id: string) {
  const jd = await prisma.jobDescription.findUnique({ where: { id } });
  if (!jd) throw new ApiError(404, "Job description not found");
  return jd;
}

export async function updateJd(id: string, data: UpdateJdInput) {
  await getJd(id);
  return prisma.jobDescription.update({ where: { id }, data });
}

export async function deleteJd(id: string) {
  const jd = await getJd(id);
  if (jd.filePublicId) {
    await deleteFile(jd.filePublicId).catch(() => undefined);
  }
  await prisma.jobDescription.delete({ where: { id } });
  return { id };
}
