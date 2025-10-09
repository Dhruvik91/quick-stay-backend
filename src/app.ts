import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { config } from "dotenv";
// import passport from "passport";
import swaggerUi from "swagger-ui-express";
// import session from "express-session";
// import "./config/passport";

import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { AppDataSource } from "./config/data-source";
import { specs } from "./config/swagger";
import { ResponseUtil } from "./utils/response";
import userRoutes from "./routes/userRoutes";
import uploadRoutes from "./routes/uploadRoutes";

// Load environment variables
config();

const app: Express = express();

// Initialize TypeORM
AppDataSource.initialize()
  .then(async () => {
    logger.info("Database connection established");
  })
  .catch((error) => {
    logger.error("Error during Data Source initialization:", error);
    process.exit(1);
  });

// Security middleware
app.use(helmet());

// HTTP request logging with Morgan
const morganFormat = ":method-colored :url :status-colored :response-time ms";
const morganFormatPlain = ":method :url :status :response-time ms";

// Custom token for colored method
morgan.token("method-colored", (req) => {
  const method = req.method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  const colors: Record<string, string> = {
    GET: "\x1b[32m", // green
    POST: "\x1b[34m", // blue
    PUT: "\x1b[33m", // yellow
    DELETE: "\x1b[31m", // red
    PATCH: "\x1b[35m", // magenta
  };
  const color = colors[method] || "\x1b[37m"; // default to white
  return `${color}${method}\x1b[0m`;
});

// Custom token for colored status
morgan.token("status-colored", (req, res) => {
  const status = res.statusCode;
  let color = "\x1b[37m"; // default to white

  if (status >= 200 && status < 300)
    color = "\x1b[32m"; // green for 2xx
  else if (status >= 300 && status < 400)
    color = "\x1b[33m"; // yellow for 3xx
  else if (status >= 400 && status < 500)
    color = "\x1b[31m"; // red for 4xx
  else if (status >= 500) color = "\x1b[31m"; // red for 5xx

  return `${color}${status}\x1b[0m`;
});

// Use plain format for file logging (no colors)
app.use(
  morgan(morganFormatPlain, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// CORS configuration
const allowedOrigins = [
  "http://localhost:4000",
  "https://www.quickstay.homes"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
// app.use(
//   session({ secret: "keyboard cat", resave: false, saveUninitialized: true })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// Compression middleware
app.use(compression());

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Quick Stay Backend API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
      docExpansion: "list",
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
  })
);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     tags: [Health]
 *     description: Check if the API is running and get basic information
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         documentation:
 *                           type: string
 *                           description: Link to API documentation
 *                         version:
 *                           type: string
 *                           description: API version
 *                         status:
 *                           type: string
 *                           description: API status
 */
// Routes
app.get("/", (req, res) => {
  ResponseUtil.success(res, "Express API is running", {
    documentation: "/api-docs",
    version: "1.0.0",
    status: "active",
  });
});

// User routes
app.use("/api/users", userRoutes);

// Upload routes
app.use("/api/uploads", uploadRoutes);

// Error handling
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(
      `API Documentation available at http://localhost:${PORT}/api-docs`
    );
  });
}

export default app;
