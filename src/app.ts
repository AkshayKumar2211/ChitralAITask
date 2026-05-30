import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import apiRouter from "./routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "chitralai-backend" });
});

app.use("/api/v1", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
