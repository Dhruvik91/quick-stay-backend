import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quick Stay Backend API",
      version: "1.0.0",
      description: "API documentation for Quick Stay accommodation platform",
      contact: {
        name: "API Support",
        email: "support@quickstay.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://quick-stay-backend.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Standardized Response Format
        ApiResponse: {
          type: "object",
          required: ["success", "message", "data"],
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the operation was successful",
            },
            message: {
              type: "string",
              description: "Descriptive message about the operation result",
            },
            data: {
              type: "object",
              description: "Response data (object, array, or empty object)",
            },
          },
        },
        SuccessResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiResponse" },
            {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: true,
                },
              },
            },
          ],
        },
        ErrorResponse: {
          allOf: [
            { $ref: "#/components/schemas/ApiResponse" },
            {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                  example: false,
                },
                data: {
                  type: "object",
                  example: {},
                },
              },
            },
          ],
        },
        // User/Accommodation Schemas
        User: {
          type: "object",
          required: ["name", "property_name", "type", "property_type", "address", "price"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the accommodation",
            },
            name: {
              type: "string",
              description: "Name of the accommodation",
            },
            property_name: {
              type: "string",
              description: "Name of the property",
            },
            type: {
              type: "string",
              enum: ["PG", "Rental", "Hostel", "Co-living"],
              description: "Type of accommodation",
            },
            property_type: {
              type: "string",
              enum: ["Boys", "Girls", "Both"],
              description: "Property type for gender preference",
            },
            address: {
              type: "string",
              description: "Address of the accommodation",
            },
            price: {
              type: "number",
              description: "Price of the accommodation",
            },
            rating: {
              type: "number",
              minimum: 0,
              maximum: 5,
              description: "Rating of the accommodation",
            },
            description: {
              type: "string",
              description: "Description of the accommodation",
            },
            verified: {
              type: "boolean",
              default: false,
              description: "Whether the accommodation is verified",
            },
            amenities: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of amenities available",
            },
            email: {
              type: "string",
              format: "email",
              description: "Contact email",
            },
            phone: {
              type: "string",
              description: "Contact phone number",
            },
            google_map_link: {
              type: "string",
              description: "Google Maps link for the property location",
            },
            is_active: {
              type: "boolean",
              default: false,
              description: "Whether the accommodation is active",
            },
            is_deleted: {
              type: "boolean",
              default: false,
              description: "Whether the accommodation is deleted",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
            deleted_at: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Deletion timestamp",
            },
          },
        },
        // DTOs
        CreateUserDto: {
          type: "object",
          required: ["name", "property_name", "type", "property_type", "address", "price"],
          properties: {
            name: {
              type: "string",
              description: "Name of the accommodation",
            },
            property_name: {
              type: "string",
              description: "Name of the property",
            },
            type: {
              type: "string",
              enum: ["PG", "Rental", "Hostel", "Co-living"],
              description: "Type of accommodation",
            },
            property_type: {
              type: "string",
              enum: ["Boys", "Girls", "Both"],
              description: "Property type for gender preference",
            },
            address: {
              type: "string",
              description: "Address of the accommodation",
            },
            price: {
              type: "number",
              minimum: 0,
              description: "Price of the accommodation",
            },
            rating: {
              type: "number",
              minimum: 0,
              maximum: 5,
              description: "Rating of the accommodation",
            },
            description: {
              type: "string",
              description: "Description of the accommodation",
            },
            amenities: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of amenities available",
            },
            email: {
              type: "string",
              format: "email",
              description: "Contact email",
            },
            phone: {
              type: "string",
              description: "Contact phone number",
            },
            google_map_link: {
              type: "string",
              description: "Google Maps link for the property location",
            },
          },
        },
        UpdateUserDto: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the accommodation",
            },
            property_name: {
              type: "string",
              description: "Name of the property",
            },
            type: {
              type: "string",
              enum: ["PG", "Rental", "Hostel", "Co-living"],
              description: "Type of accommodation",
            },
            property_type: {
              type: "string",
              enum: ["Boys", "Girls", "Both"],
              description: "Property type for gender preference",
            },
            address: {
              type: "string",
              description: "Address of the accommodation",
            },
            price: {
              type: "number",
              minimum: 0,
              description: "Price of the accommodation",
            },
            rating: {
              type: "number",
              minimum: 0,
              maximum: 5,
              description: "Rating of the accommodation",
            },
            description: {
              type: "string",
              description: "Description of the accommodation",
            },
            verified: {
              type: "boolean",
              description: "Whether the accommodation is verified",
            },
            amenities: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of amenities available",
            },
            email: {
              type: "string",
              format: "email",
              description: "Contact email",
            },
            phone: {
              type: "string",
              description: "Contact phone number",
            },
            google_map_link: {
              type: "string",
              description: "Google Maps link for the property location",
            },
            is_active: {
              type: "boolean",
              description: "Whether the accommodation is active",
            },
          },
        },
        // Query Parameters
        GetUsersQueryDto: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["PG", "Rental", "Hostel", "Co-living"],
              description: "Filter by accommodation type",
            },
            verified: {
              type: "boolean",
              description: "Filter by verification status",
            },
            minPrice: {
              type: "number",
              minimum: 0,
              description: "Minimum price filter",
            },
            maxPrice: {
              type: "number",
              minimum: 0,
              description: "Maximum price filter",
            },
            search: {
              type: "string",
              description: "Search in name, address, or description",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
              description: "Number of results per page",
            },
            offset: {
              type: "integer",
              minimum: 0,
              default: 0,
              description: "Number of results to skip",
            },
          },
        },
        // Pagination Response
        PaginationInfo: {
          type: "object",
          properties: {
            total: {
              type: "integer",
              description: "Total number of accommodations",
            },
            limit: {
              type: "integer",
              description: "Number of results per page",
            },
            offset: {
              type: "integer",
              description: "Number of results skipped",
            },
            hasMore: {
              type: "boolean",
              description: "Whether there are more results",
            },
          },
        },
        // Health Check Response
        HealthCheckData: {
          type: "object",
          properties: {
            documentation: {
              type: "string",
              description: "Link to API documentation",
            },
            version: {
              type: "string",
              description: "API version",
            },
            status: {
              type: "string",
              description: "API status",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/app.ts"],
};

export const specs = swaggerJsdoc(options);
