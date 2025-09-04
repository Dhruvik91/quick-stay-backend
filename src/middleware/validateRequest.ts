import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ResponseUtil } from "../utils/response";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

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

// Enhanced class-validator support for body validation
export const validateBody = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
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

// Class-validator support for query parameters
export const validateQuery = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToClass(dtoClass, req.query);
      const errors = await validate(dtoObject as object);

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        return ResponseUtil.failure(
          res,
          "Query validation failed",
          400,
          errorMessages
        );
      }

      req.query = dtoObject as any;
      next();
    } catch (error) {
      return ResponseUtil.failure(res, "Query validation error", 400);
    }
  };
};

// Class-validator support for route parameters
export const validateParams = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToClass(dtoClass, req.params);
      const errors = await validate(dtoObject as object);

      if (errors.length > 0) {
        const errorMessages = errors
          .map((error) => Object.values(error.constraints || {}))
          .flat();
        return ResponseUtil.failure(
          res,
          "Parameter validation failed",
          400,
          errorMessages
        );
      }

      req.params = dtoObject as any;
      next();
    } catch (error) {
      return ResponseUtil.failure(res, "Parameter validation error", 400);
    }
  };
};

// Legacy class-validator support (deprecated, use specific validators above)
export const validateClassRequest = (dtoClass: any) => {
  return validateBody(dtoClass);
};
