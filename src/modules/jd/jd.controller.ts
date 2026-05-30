import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { ApiError } from "../../utils/api-error";
import * as jdService from "./jd.service";

export const createJdHandler = asyncHandler(async (req: Request, res: Response) => {
  const jd = await jdService.createJd(req.body);
  res.status(201).json({ success: true, data: jd });
});

export const uploadJdHandler = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) throw new ApiError(400, "No file uploaded");
  const title = (req.body?.title as string | undefined) || undefined;
  const jd = await jdService.uploadJdFile(file, title);
  res.status(201).json({ success: true, data: jd });
});

export const listJdsHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = await jdService.listJds(req.query as any);
  res.json({ success: true, ...data });
});

export const getJdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const jd = await jdService.getJd(id);
  res.json({ success: true, data: jd });
});

export const updateJdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const jd = await jdService.updateJd(id, req.body);
  res.json({ success: true, data: jd });
});

export const deleteJdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await jdService.deleteJd(id);
  res.json({ success: true, ...result });
});
