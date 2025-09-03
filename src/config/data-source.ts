import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import path from "path";

// Load environment variables
config();

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "kick_shuffle",
  synchronize: !isProduction,
  // logging: !isProduction,
  entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
  migrations: [path.join(__dirname, "../migrations/**/*.{ts,js}")],
  subscribers: [path.join(__dirname, "../subscribers/**/*.{ts,js}")],
  extra: {
    // Set timezone to UTC to ensure consistency
    timezone: "UTC",
  },
  // ✅ Add SSL support for Azure PostgreSQL
  ssl: isProduction
    ? {
        rejectUnauthorized: false, // allows self-signed or Azure-managed certificates
      }
    : false,
});
