import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { logger } from "../utils/logger";
import { AppError } from "../middleware/errorHandler";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(user);
      logger.info(`User created with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return null;
      }

      Object.assign(user, userData);
      const updatedUser = await this.userRepository.save(user);
      logger.info(`User updated with ID: ${id}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  async getUsers(filters?: {
    type?: "PG" | "Rental" | "Hostel" | "Co-living";
    verified?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder("user");

      // Input validation and sanitization
      const validTypes = ["PG", "Rental", "Hostel", "Co-living"];

      // Apply filters with proper validation
      if (filters?.type) {
        if (!validTypes.includes(filters.type)) {
          throw new AppError(
            `Invalid type: ${filters.type}. Must be one of: ${validTypes.join(", ")}`,
            400
          );
        }
        queryBuilder.andWhere("user.type = :type", { type: filters.type });
      }

      if (filters?.verified !== undefined) {
        if (typeof filters.verified !== "boolean") {
          throw new AppError("Verified filter must be a boolean value", 400);
        }
        queryBuilder.andWhere("user.verified = :verified", {
          verified: filters.verified,
        });
      }

      if (filters?.minPrice !== undefined) {
        const minPrice = Number(filters.minPrice);
        if (isNaN(minPrice) || minPrice < 0) {
          throw new AppError("minPrice must be a valid positive number", 400);
        }
        queryBuilder.andWhere("user.price >= :minPrice", { minPrice });
      }

      if (filters?.maxPrice !== undefined) {
        const maxPrice = Number(filters.maxPrice);
        if (isNaN(maxPrice) || maxPrice < 0) {
          throw new AppError("maxPrice must be a valid positive number", 400);
        }
        queryBuilder.andWhere("user.price <= :maxPrice", { maxPrice });
      }

      // Validate price range if both min and max are provided
      if (filters?.minPrice !== undefined && filters?.maxPrice !== undefined) {
        const minPrice = Number(filters.minPrice);
        const maxPrice = Number(filters.maxPrice);
        if (minPrice > maxPrice) {
          throw new AppError("minPrice cannot be greater than maxPrice", 400);
        }
      }

      if (filters?.search) {
        // Sanitize search input - remove potentially dangerous characters
        const sanitizedSearch = filters.search.trim().replace(/[<>'"]/g, "");
        if (sanitizedSearch.length > 0) {
          queryBuilder.andWhere(
            "(user.name ILIKE :search OR user.address ILIKE :search OR user.description ILIKE :search)",
            { search: `%${sanitizedSearch}%` }
          );
        }
      }

      // Get total count before applying pagination
      const total = await queryBuilder.getCount();

      // Apply pagination with validation
      if (filters?.limit !== undefined) {
        const limit = Number(filters.limit);
        if (isNaN(limit) || limit < 1 || limit > 1000) {
          throw new AppError(
            "limit must be a valid number between 1 and 1000",
            400
          );
        }
        queryBuilder.limit(limit);
      } else {
        // Default limit if not specified
        queryBuilder.limit(50);
      }

      if (filters?.offset !== undefined) {
        const offset = Number(filters.offset);
        if (isNaN(offset) || offset < 0) {
          throw new AppError("offset must be a valid non-negative number", 400);
        }
        queryBuilder.offset(offset);
      }

      // Order by creation date (newest first)
      queryBuilder.orderBy("user.created_at", "DESC");

      const users = await queryBuilder.getMany();

      logger.info(`Retrieved ${users.length} users out of ${total} total`);
      return { users, total };
    } catch (error) {
      logger.error("Error retrieving users:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return user;
    } catch (error) {
      logger.error(`Error retrieving user with ID ${id}:`, error);
      throw error;
    }
  }
}
