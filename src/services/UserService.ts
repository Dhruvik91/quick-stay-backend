import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { logger } from "../utils/logger";

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
    type?: 'PG' | 'Rental' | 'Hostel' | 'Co-living';
    verified?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder("user");

      // Apply filters
      if (filters?.type) {
        queryBuilder.andWhere("user.type = :type", { type: filters.type });
      }

      if (filters?.verified !== undefined) {
        queryBuilder.andWhere("user.verified = :verified", { verified: filters.verified });
      }

      if (filters?.minPrice) {
        queryBuilder.andWhere("user.price >= :minPrice", { minPrice: filters.minPrice });
      }

      if (filters?.maxPrice) {
        queryBuilder.andWhere("user.price <= :maxPrice", { maxPrice: filters.maxPrice });
      }

      if (filters?.search) {
        queryBuilder.andWhere(
          "(user.name ILIKE :search OR user.address ILIKE :search OR user.description ILIKE :search)",
          { search: `%${filters.search}%` }
        );
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply pagination
      if (filters?.limit) {
        queryBuilder.limit(filters.limit);
      }
      if (filters?.offset) {
        queryBuilder.offset(filters.offset);
      }

      // Order by creation date (newest first)
      queryBuilder.orderBy("user.createdAt", "DESC");

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
