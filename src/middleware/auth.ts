import { Response, NextFunction, Request } from "express";
import { ResponseUtil } from "../utils/response";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return ResponseUtil.failure(res, "Authentication required", 401);
  }

  try {
    const decoded = token === process.env.SECRET_KEY;
    if (!decoded) {
      return ResponseUtil.failure(res, "User not found", 401);
    }
    next();
  } catch (error) {
    return ResponseUtil.failure(res, "Invalid token", 401);
  }
};
