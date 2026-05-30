import { Request, Response, NextFunction } from "express";
import { z } from "zod";

type AnySchema = z.ZodType;

type ValidationTargets = {
  body?: AnySchema;
  query?: AnySchema;
  params?: AnySchema;
};

function setReadOnlyProp(req: Request, key: "query" | "params", value: unknown) {
  // Express 5 exposes `req.query` (and sometimes `req.params`) as read-only
  // getters, so plain assignment throws. Override the descriptor instead.
  Object.defineProperty(req, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}

export const validate =
  (schemas: ValidationTargets) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) setReadOnlyProp(req, "query", schemas.query.parse(req.query));
      if (schemas.params) setReadOnlyProp(req, "params", schemas.params.parse(req.params));
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: err.issues ?? err.message,
      });
    }
  };
