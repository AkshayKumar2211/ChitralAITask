import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { ApiError } from "../../utils/api-error";
import * as resumeService from "./resume.service";

export const uploadResumesHandler = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  if (files.length === 0) throw new ApiError(400, "No files uploaded");

  const results = await resumeService.ingestResumes(files);
  const succeeded = results.filter((r) => r.ok).length;
  res.status(201).json({
    success: true,
    message: `Uploaded ${succeeded}/${results.length} resumes`,
    results,
  });
});

export const listResumesHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await resumeService.listResumes(req.query as any);
  res.json({ success: true, ...data });
});

export const getResumeHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const resume = await resumeService.getResume(id);
  res.json({ success: true, data: resume });
});

export const updateResumeHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const resume = await resumeService.updateResume(id, req.body);
  res.json({ success: true, data: resume });
});

export const deleteResumeHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await resumeService.deleteResume(id);
  res.json({ success: true, ...result });
});
