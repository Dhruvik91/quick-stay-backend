import { CreateUserDto, UpdateUserDto, GetUsersQueryDto } from "../types/dto";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

describe("DTO Validation Tests", () => {
  describe("CreateUserDto", () => {
    it("should validate required fields", async () => {
      const validData = {
        name: "Test Accommodation",
        type: "Rental",
        address: "123 Test Street",
        price: 1500,
      };

      const dto = plainToClass(CreateUserDto, validData);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("should fail validation for missing required fields", async () => {
      const invalidData = {
        name: "Test Accommodation",
        // missing type, address, price
      };

      const dto = plainToClass(CreateUserDto, invalidData);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should fail validation for invalid type", async () => {
      const invalidData = {
        name: "Test Accommodation",
        type: "InvalidType",
        address: "123 Test Street",
        price: 1500,
      };

      const dto = plainToClass(CreateUserDto, invalidData);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should fail validation for negative price", async () => {
      const invalidData = {
        name: "Test Accommodation",
        type: "Rental",
        address: "123 Test Street",
        price: -100,
      };

      const dto = plainToClass(CreateUserDto, invalidData);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("GetUsersQueryDto", () => {
    it("should validate valid query parameters", async () => {
      const validQuery = {
        type: "Rental",
        verified: "true",
        minPrice: "1000",
        maxPrice: "2000",
        limit: "10",
        offset: "0",
      };

      const dto = plainToClass(GetUsersQueryDto, validQuery);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it("should fail validation for invalid limit", async () => {
      const invalidQuery = {
        limit: "150", // exceeds max of 100
      };

      const dto = plainToClass(GetUsersQueryDto, invalidQuery);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
