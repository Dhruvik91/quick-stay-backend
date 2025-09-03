import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { RequestWithUser } from "../types/custom";
import { ResponseUtil } from "../utils/response";

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return ResponseUtil.failure(res, "Authentication required", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId },
      relations: ["role"],
    });
    if (!user) {
      return ResponseUtil.failure(res, "User not found", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    return ResponseUtil.failure(res, "Invalid token", 401);
  }
};
