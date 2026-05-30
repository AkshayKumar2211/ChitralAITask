import { Router } from "express";
import { uploadResumes } from "../../middlewares/upload.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  listResumesQuery,
  resumeIdParam,
  updateResumeSchema,
} from "./resume.validation";
import {
  uploadResumesHandler,
  listResumesHandler,
  getResumeHandler,
  updateResumeHandler,
  deleteResumeHandler,
} from "./resume.controller";

const router = Router();

router.post("/", uploadResumes.array("resumes", 50), uploadResumesHandler);
router.get("/", validate({ query: listResumesQuery }), listResumesHandler);
router.get("/:id", validate({ params: resumeIdParam }), getResumeHandler);
router.patch(
  "/:id",
  validate({ params: resumeIdParam, body: updateResumeSchema }),
  updateResumeHandler
);
router.delete("/:id", validate({ params: resumeIdParam }), deleteResumeHandler);

export default router;
