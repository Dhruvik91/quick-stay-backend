import { Request } from "express";
import { User } from "../entities/User";

export interface RequestWithUser extends Request {
  user?: User;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface UserFilters extends PaginationParams {
  type?: 'PG' | 'Rental' | 'Hostel' | 'Co-living';
  verified?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
