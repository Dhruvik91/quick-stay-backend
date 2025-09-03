# Quick Stay Backend - User Module

This module provides a complete User management system for accommodation listings without authentication.

## Features

- **User Entity**: Based on the Accommodation interface with all required fields
- **No Password Field**: Authentication module not included as requested
- **Three Main APIs**: Create, Update, and Search functionality
- **Comprehensive Validation**: Input validation for all endpoints
- **Swagger Documentation**: Complete API documentation

## User Model Fields

The User entity includes the following fields based on the Accommodation interface:

- `id` (UUID): Unique identifier
- `name` (string): Name of the accommodation
- `type` (enum): PG, Rental, Hostel, or Co-living
- `address` (text): Address of the accommodation
- `price` (decimal): Price of the accommodation
- `rating` (decimal, optional): Rating (0-5)
- `description` (text, optional): Description of the accommodation
- `imageUrl` (string, optional): URL of the accommodation image
- `verified` (boolean): Whether the accommodation is verified
- `amenities` (array): List of available amenities
- `contact` (JSON, optional): Contact information with phone and email
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

## API Endpoints

### 1. Create User
- **POST** `/api/users`
- **Description**: Create a new accommodation listing
- **Required Fields**: `name`, `type`, `address`, `price`
- **Optional Fields**: `rating`, `description`, `imageUrl`, `verified`, `amenities`, `contact`

### 2. Update User
- **PUT** `/api/users/:id`
- **Description**: Update an existing accommodation listing
- **Parameters**: `id` (UUID)
- **Body**: Any fields to update

### 3. Get Users (Search)
- **GET** `/api/users`
- **Description**: Retrieve accommodation listings with filters and pagination
- **Query Parameters**:
  - `type`: Filter by accommodation type
  - `verified`: Filter by verification status
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
  - `search`: Search in name, address, or description
  - `limit`: Number of results per page (1-100, default: 10)
  - `offset`: Number of results to skip (default: 0)

### 4. Get User by ID
- **GET** `/api/users/:id`
- **Description**: Retrieve a specific accommodation listing by ID
- **Parameters**: `id` (UUID)

## Response Format

All endpoints return a standardized response format:

```json
{
  "success": true,
  "message": "Operation message",
  "data": {
    // Response data
  }
}
```

## Search Features

The search endpoint supports:
- **Type filtering**: Filter by PG, Rental, Hostel, or Co-living
- **Price range**: Filter by minimum and maximum price
- **Verification status**: Filter by verified/unverified listings
- **Text search**: Search in name, address, and description fields
- **Pagination**: Limit and offset for large result sets

## Validation

- **Required fields**: name, type, address, price
- **Type validation**: Must be one of: PG, Rental, Hostel, Co-living
- **Price validation**: Must be a positive number
- **Rating validation**: Must be between 0 and 5
- **Pagination validation**: Limit between 1-100, offset must be non-negative

## Database

The module uses TypeORM with PostgreSQL and includes:
- Automatic UUID generation for IDs
- Timestamps for creation and updates
- Proper data types (decimal for prices, enum for types)
- JSON storage for contact information
- Array storage for amenities

## Getting Started

1. Ensure your database is running and configured
2. The User entity will be automatically synchronized with the database
3. Access the API documentation at `/api-docs`
4. Test the endpoints using the provided Swagger interface

## Example Usage

### Create a new accommodation:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunset Apartments",
    "type": "Rental",
    "address": "123 Main Street, City, State 12345",
    "price": 1500,
    "rating": 4.5,
    "description": "Beautiful apartment with modern amenities",
    "amenities": ["WiFi", "Parking", "Gym"],
    "contact": {
      "phone": "+1234567890",
      "email": "contact@sunsetapartments.com"
    }
  }'
```

### Search accommodations:
```bash
curl "http://localhost:3000/api/users?type=Rental&minPrice=1000&maxPrice=2000&limit=10&offset=0"
```
