// Role-based authorization middleware commented out as authentication is not required
// import { Request, Response, NextFunction } from "express";
// import { RequestWithUser } from "../types/custom";
// import { RoleType } from "../entities/Role";
// import { ResponseUtil } from "../utils/response";

// export const requireRole = (allowedRoles: RoleType[]) => {
//   return (req: RequestWithUser, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return ResponseUtil.failure(res, "Authentication required", 401);
//     }

//     if (!req.user.role) {
//       return ResponseUtil.failure(res, "User role not found", 403);
//     }

//     if (!allowedRoles.includes(req.user.role.type)) {
//       return ResponseUtil.failure(res, "Insufficient permissions", 403);
//     }

//     next();
//   };
// };

// export const requirePermission = (permission: string) => {
//   return (req: RequestWithUser, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return ResponseUtil.failure(res, "Authentication required", 401);
//     }

//     if (!req.user.role) {
//       return ResponseUtil.failure(res, "User role not found", 403);
//     }

//     if (!req.user.role.permissions[permission]) {
//       return ResponseUtil.failure(res, "Insufficient permissions", 403);
//     }

//     next();
//   };
// };

// export const requireAdmin = requireRole([RoleType.ADMIN]);
// export const requireModerator = requireRole([
//   RoleType.ADMIN,
//   RoleType.MODERATOR,
// ]);
