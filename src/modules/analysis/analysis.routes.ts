import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import {
  analyzeBody,
  resultsQuery,
  exportQuery,
  jdIdParam,
  scoreIdParam,
  updateScoreSchema,
} from "./analysis.validation";
import {
  analyzeJobHandler,
  getResultsHandler,
  exportResultsHandler,
  getScoreResultHandler,
  updateScoreResultHandler,
  deleteScoreResultHandler,
} from "./analysis.controller";

const router = Router();

// Single score-result CRUD — registered before /:jdId routes so the literal
// "results" segment wins routing precedence.
router.get(
  "/results/:id",
  validate({ params: scoreIdParam }),
  getScoreResultHandler
);
router.patch(
  "/results/:id",
  validate({ params: scoreIdParam, body: updateScoreSchema }),
  updateScoreResultHandler
);
router.delete(
  "/results/:id",
  validate({ params: scoreIdParam }),
  deleteScoreResultHandler
);

// Batch analysis + per-JD results
router.post(
  "/:jdId",
  validate({ params: jdIdParam, body: analyzeBody }),
  analyzeJobHandler
);
router.get(
  "/:jdId/results",
  validate({ params: jdIdParam, query: resultsQuery }),
  getResultsHandler
);
router.get(
  "/:jdId/export",
  validate({ params: jdIdParam, query: exportQuery }),
  exportResultsHandler
);

export default router;
