import { Response } from "express";

export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

export class ResponseUtil {
  /**
   * Send a successful response
   * @param res - Express response object
   * @param message - Success message
   * @param data - Response data (object or array of objects)
   * @param statusCode - HTTP status code (default: 200)
   */
  static success(
    res: Response,
    message: string,
    data: any = {},
    statusCode: number = 200
  ): void {
    const response: ApiResponse = {
      success: true,
      message,
      data,
    };

    res.status(statusCode).json(response);
  }

  /**
   * Send a failure response
   * @param res - Express response object
   * @param message - Error message
   * @param statusCode - HTTP status code (default: 400)
   * @param data - Error details or additional data (optional)
   */
  static failure(
    res: Response,
    message: string,
    statusCode: number = 400,
    data: any = {}
  ): void {
    const response: ApiResponse = {
      success: false,
      message,
      data,
    };

    res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   * @param res - Express response object
   * @param message - Success message
   * @param data - Response data
   */
  static created(res: Response, message: string, data: any = {}): void {
    this.success(res, message, data, 201);
  }

  /**
   * Send a no content response (204)
   * @param res - Express response object
   * @param message - Success message
   */
  static noContent(res: Response, message: string = "No content"): void {
    const response: ApiResponse = {
      success: true,
      message,
      data: {},
    };

    res.status(204).json(response);
  }

  /**
   * Send a bad request response (400)
   * @param res - Express response object
   * @param message - Error message
   * @param data - Error details (optional)
   */
  static badRequest(res: Response, message: string, data: any = {}): void {
    this.failure(res, message, 400, data);
  }

  /**
   * Send a not found response (404)
   * @param res - Express response object
   * @param message - Error message
   * @param data - Error details (optional)
   */
  static notFound(res: Response, message: string, data: any = {}): void {
    this.failure(res, message, 404, data);
  }

  /**
   * Send an internal server error response (500)
   * @param res - Express response object
   * @param message - Error message
   * @param data - Error details (optional)
   */
  static internalServerError(res: Response, message: string, data: any = {}): void {
    this.failure(res, message, 500, data);
  }
}
