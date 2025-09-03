import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { ResponseUtil } from "../utils/response";
import { logger } from "../utils/logger";

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
      const userData = req.body;

      // Validate required fields
      if (
        !userData.name ||
        !userData.type ||
        !userData.address ||
        !userData.price
      ) {
        ResponseUtil.badRequest(
          res,
          "Missing required fields: name, type, address, price"
        );
        return;
      }

      // Validate type enum
      const validTypes = ["PG", "Rental", "Hostel", "Co-living"];
      if (!validTypes.includes(userData.type)) {
        ResponseUtil.badRequest(
          res,
          `Invalid type. Must be one of: ${validTypes.join(", ")}`
        );
        return;
      }

      // Validate price
      if (typeof userData.price !== "number" || userData.price <= 0) {
        ResponseUtil.badRequest(res, "Price must be a positive number");
        return;
      }

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
      const userData = req.body;

      if (!id) {
        ResponseUtil.badRequest(res, "User ID is required");
        return;
      }

      // Validate type enum if provided
      if (userData.type) {
        const validTypes = ["PG", "Rental", "Hostel", "Co-living"];
        if (!validTypes.includes(userData.type)) {
          ResponseUtil.badRequest(
            res,
            `Invalid type. Must be one of: ${validTypes.join(", ")}`
          );
          return;
        }
      }

      // Validate price if provided
      if (
        userData.price !== undefined &&
        (typeof userData.price !== "number" || userData.price <= 0)
      ) {
        ResponseUtil.badRequest(res, "Price must be a positive number");
        return;
      }

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
      const {
        type,
        verified,
        minPrice,
        maxPrice,
        search,
        limit = 10,
        offset = 0,
      } = req.query;

      // Parse and validate query parameters
      const filters: any = {};

      if (type) {
        const validTypes = ["PG", "Rental", "Hostel", "Co-living"];
        if (!validTypes.includes(type as string)) {
          ResponseUtil.badRequest(
            res,
            `Invalid type. Must be one of: ${validTypes.join(", ")}`
          );
          return;
        }
        filters.type = type;
      }

      if (verified !== undefined) {
        filters.verified = verified === "true";
      }

      if (minPrice !== undefined) {
        const minPriceNum = parseFloat(minPrice as string);
        if (isNaN(minPriceNum) || minPriceNum < 0) {
          ResponseUtil.badRequest(res, "minPrice must be a positive number");
          return;
        }
        filters.minPrice = minPriceNum;
      }

      if (maxPrice !== undefined) {
        const maxPriceNum = parseFloat(maxPrice as string);
        if (isNaN(maxPriceNum) || maxPriceNum < 0) {
          ResponseUtil.badRequest(res, "maxPrice must be a positive number");
          return;
        }
        filters.maxPrice = maxPriceNum;
      }

      if (search) {
        filters.search = search as string;
      }

      const limitNum = parseInt(limit as string);
      const offsetNum = parseInt(offset as string);

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        ResponseUtil.badRequest(
          res,
          "limit must be a number between 1 and 100"
        );
        return;
      }

      if (isNaN(offsetNum) || offsetNum < 0) {
        ResponseUtil.badRequest(res, "offset must be a non-negative number");
        return;
      }

      filters.limit = limitNum;
      filters.offset = offsetNum;

      const result = await this.userService.getUsers(filters);

      ResponseUtil.success(res, "Users retrieved successfully", {
        users: result.users,
        pagination: {
          total: result.total,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: result.total > filters.offset + filters.limit,
        },
      });
    } catch (error) {
      logger.error("Error in getUsers controller:", error);
      ResponseUtil.internalServerError(res, "Failed to retrieve users");
    }
  };

  /**
   * Get a single user by ID
   */
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        ResponseUtil.badRequest(res, "User ID is required");
        return;
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        ResponseUtil.notFound(res, "User not found");
        return;
      }

      ResponseUtil.success(res, "User retrieved successfully", user);
    } catch (error) {
      logger.error("Error in getUserById controller:", error);
      ResponseUtil.internalServerError(res, "Failed to retrieve user");
    }
  };
}
