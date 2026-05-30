import { Router } from "express";
import resumeRoutes from "../modules/resume/resume.routes";
import jdRoutes from "../modules/jd/jd.routes";
import analysisRoutes from "../modules/analysis/analysis.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "Chitralai API v1",
    endpoints: {
      resumes: "/api/v1/resumes",
      jds: "/api/v1/jds",
      analysis: "/api/v1/analysis/:jdId",
    },
  });
});

router.use("/resumes", resumeRoutes);
router.use("/jds", jdRoutes);
router.use("/analysis", analysisRoutes);

export default router;
