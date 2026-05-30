import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler";
import * as analysisService from "./analysis.service";

export const analyzeJobHandler = asyncHandler(async (req: Request, res: Response) => {
  const { jdId } = req.params as { jdId: string };
  const result = await analysisService.analyzeJob(jdId, req.body ?? {});
  res.json({ success: true, ...result });
});

export const getResultsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { jdId } = req.params as { jdId: string };
  const data = await analysisService.getResults(jdId, req.query as any);
  res.json({ success: true, ...data });
});

export const getScoreResultHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await analysisService.getScoreResult(id);
  res.json({ success: true, data: result });
});

export const updateScoreResultHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await analysisService.updateScoreResult(id, req.body);
  res.json({ success: true, data: result });
});

export const deleteScoreResultHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const result = await analysisService.deleteScoreResult(id);
  res.json({ success: true, ...result });
});

export const exportResultsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { jdId } = req.params as { jdId: string };
  const csv = await analysisService.exportResultsCsv(jdId);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="results-${jdId}.csv"`
  );
  res.send(csv);
});
