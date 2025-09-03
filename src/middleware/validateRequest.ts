import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ResponseUtil } from "../utils/response";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseUtil.failure(res, "Validation failed", 400, errors.array());
  }
  next();
};

// Legacy class-validator support
export const validateClassRequest = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { validate } = await import("class-validator");
      const { plainToClass } = await import("class-transformer");

      const dtoObject = plainToClass(dtoClass, req.body);
      const errors = await validate(dtoObject);

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        return ResponseUtil.failure(
          res,
          "Validation failed",
          400,
          errorMessages
        );
      }

      req.body = dtoObject;
      next();
    } catch (error) {
      return ResponseUtil.failure(res, "Validation error", 400);
    }
  };
};
