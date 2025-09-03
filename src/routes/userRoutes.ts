import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - address
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         name:
 *           type: string
 *           description: Name of the accommodation
 *         type:
 *           type: string
 *           enum: [PG, Rental, Hostel, Co-living]
 *           description: Type of accommodation
 *         address:
 *           type: string
 *           description: Address of the accommodation
 *         price:
 *           type: number
 *           description: Price of the accommodation
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Rating of the accommodation
 *         description:
 *           type: string
 *           description: Description of the accommodation
 *         imageUrl:
 *           type: string
 *           description: URL of the accommodation image
 *         verified:
 *           type: boolean
 *           default: false
 *           description: Whether the accommodation is verified
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of amenities available
 *         contact:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *           description: Contact information
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new accommodation listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - address
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sunset Apartments"
 *               type:
 *                 type: string
 *                 enum: [PG, Rental, Hostel, Co-living]
 *                 example: "Rental"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, City, State 12345"
 *               price:
 *                 type: number
 *                 example: 1500
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.5
 *               description:
 *                 type: string
 *                 example: "Beautiful apartment with modern amenities"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               verified:
 *                 type: boolean
 *                 example: false
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["WiFi", "Parking", "Gym"]
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *                   email:
 *                     type: string
 *                     example: "contact@sunsetapartments.com"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update an existing accommodation listing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [PG, Rental, Hostel, Co-living]
 *               address:
 *                 type: string
 *               price:
 *                 type: number
 *               rating:
 *                 type: number
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               verified:
 *                 type: boolean
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               contact:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", userController.updateUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users with filters
 *     tags: [Users]
 *     description: Retrieve accommodation listings with optional filters and pagination
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PG, Rental, Hostel, Co-living]
 *         description: Filter by accommodation type
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, address, or description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                         users:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/User'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                               description: Total number of users
 *                             limit:
 *                               type: integer
 *                               description: Number of results per page
 *                             offset:
 *                               type: integer
 *                               description: Number of results skipped
 *                             hasMore:
 *                               type: boolean
 *                               description: Whether there are more results
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.get("/", userController.getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Retrieve a specific accommodation listing by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - missing ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", userController.getUserById);

export default router;
