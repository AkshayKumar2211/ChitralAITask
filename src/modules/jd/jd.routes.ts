import { Router } from "express";
import { uploadResumes } from "../../middlewares/upload.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createJdSchema,
  updateJdSchema,
  listJdsQuery,
  jdIdParam,
} from "./jd.validation";
import {
  createJdHandler,
  uploadJdHandler,
  listJdsHandler,
  getJdHandler,
  updateJdHandler,
  deleteJdHandler,
} from "./jd.controller";

const router = Router();

router.post("/", validate({ body: createJdSchema }), createJdHandler);
router.post("/upload", uploadResumes.single("file"), uploadJdHandler);
router.get("/", validate({ query: listJdsQuery }), listJdsHandler);
router.get("/:id", validate({ params: jdIdParam }), getJdHandler);
router.put(
  "/:id",
  validate({ params: jdIdParam, body: updateJdSchema }),
  updateJdHandler
);
router.delete("/:id", validate({ params: jdIdParam }), deleteJdHandler);

export default router;
