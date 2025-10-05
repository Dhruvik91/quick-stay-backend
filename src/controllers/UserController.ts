import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { ResponseUtil } from "../utils/response";
import { logger } from "../utils/logger";
import {
  CreateUserDto,
  UpdateUserDto,
  GetUsersQueryDto,
} from "../types/dto";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new user
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body as CreateUserDto;
      const user = await this.userService.createUser(userData);
      ResponseUtil.created(res, "User created successfully", user);
    } catch (error) {
      logger.error("Error in createUser controller:", error);
      ResponseUtil.internalServerError(res, "Failed to create user");
    }
  };

  /**
   * Update an existing user
   */
  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body as UpdateUserDto;

      const updatedUser = await this.userService.updateUser(id, userData);

      if (!updatedUser) {
        ResponseUtil.notFound(res, "User not found");
        return;
      }

      ResponseUtil.success(res, "User updated successfully", updatedUser);
    } catch (error) {
      logger.error("Error in updateUser controller:", error);
      ResponseUtil.internalServerError(res, "Failed to update user");
    }
  };

  /**
   * Get users with optional filters
   */
  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = req.query as GetUsersQueryDto;
      const result = await this.userService.getUsers(filters);

      ResponseUtil.success(res, "Users retrieved successfully", {
        users: result.users,
        pagination: {
          total: result.total,
          limit: filters.limit || 10,
          offset: filters.offset || 0,
          hasMore: result.total > (filters.offset || 0) + (filters.limit || 10),
        },
      });
    } catch (error) {
      logger.error("Error in getUsers controller:", error);
      ResponseUtil.internalServerError(res, "Failed to retrieve users");
    }
  };

  /**
   * Get a single user by slug
   */
  getUserBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const user = await this.userService.getUserBySlug(slug);

      if (!user) {
        ResponseUtil.notFound(res, "User not found");
        return;
      }

      ResponseUtil.success(res, "User retrieved successfully", user);
    } catch (error) {
      logger.error("Error in getUserBySlug controller:", error);
      ResponseUtil.internalServerError(res, "Failed to retrieve user");
    }
  };
}
