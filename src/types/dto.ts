import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEmail,
  IsPositive,
  Min,
  Max,
  IsUUID,
} from "class-validator";
import { Transform, Type } from "class-transformer";

export enum UserType {
  PG = "PG",
  RENTAL = "Rental",
  HOSTEL = "Hostel",
  CO_LIVING = "Co-living",
}

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEnum(UserType)
  type!: UserType;

  @IsString()
  address!: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price!: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @Type(() => Number)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class GetUsersQueryDto {
  @IsEnum(UserType)
  @IsOptional()
  type?: UserType;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @IsOptional()
  verified?: boolean;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @IsOptional()
  maxPrice?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  offset?: number = 0;
}

export class GetUserByIdParamsDto {
  @IsUUID()
  id!: string;
}

export class UpdateUserParamsDto {
  @IsUUID()
  id!: string;
}
