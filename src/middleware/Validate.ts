import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
      });
      next();
    } catch (error) {
      const zodErr = error as ZodError;
      return res.status(400).json({
        message: zodErr.errors[0].message,
      });
    }
  };

export default validate;
