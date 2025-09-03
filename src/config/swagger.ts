import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kick Shuffle API',
      version: '1.0.0',
      description: 'API documentation for Kick Shuffle game platform',
      contact: {
        name: 'API Support',
        email: 'support@kickshuffle.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://kick-suffle.vercel.app',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Standardized Response Format
        ApiResponse: {
          type: 'object',
          required: ['success', 'message', 'data'],
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the operation was successful'
            },
            message: {
              type: 'string',
              description: 'Descriptive message about the operation result'
            },
            data: {
              type: 'object',
              description: 'Response data (object, array, or empty object)'
            }
          }
        },
        SuccessResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                }
              }
            }
          ]
        },
        ErrorResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: false
                },
                data: {
                  type: 'object',
                  example: {}
                }
              }
            }
          ]
        },
        // Authentication Error Responses
        AuthenticationErrorResponse: {
          allOf: [
            { $ref: '#/components/schemas/ErrorResponse' },
            {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  enum: ['Authentication required', 'User not found', 'Invalid token'],
                  description: 'Specific authentication error message'
                }
              },
              examples: {
                noToken: {
                  summary: 'No authentication token provided',
                  value: {
                    success: false,
                    message: 'Authentication required',
                    data: {}
                  }
                },
                userNotFound: {
                  summary: 'User not found in database',
                  value: {
                    success: false,
                    message: 'User not found',
                    data: {}
                  }
                },
                invalidToken: {
                  summary: 'Invalid or expired token',
                  value: {
                    success: false,
                    message: 'Invalid token',
                    data: {}
                  }
                }
              }
            }
          ]
        },
        // Auth DTOs
        SignUpDto: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'username', 'password'],
          properties: {
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            username: {
              type: 'string',
              minLength: 3,
              description: 'Username (minimum 3 characters)'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Password (minimum 6 characters)'
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth (optional)'
            },
            referCode: {
              type: 'string',
              description: 'Referral code (optional)'
            }
          }
        },
        LoginDto: {
          type: 'object',
          required: ['password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              description: 'Username (either username or email is required)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address (either username or email is required)'
            },
            password: {
              type: 'string',
              description: 'Password'
            }
          }
        },
        ChangePasswordDto: {
          type: 'object',
          required: ['email', 'currentPassword', 'newPassword'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            currentPassword: {
              type: 'string',
              minLength: 6,
              description: 'Current password'
            },
            newPassword: {
              type: 'string',
              minLength: 6,
              description: 'New password'
            }
          }
        },
        EmailDto: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            }
          }
        },
        OTPValidationDto: {
          type: 'object',
          required: ['email', 'code'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            code: {
              type: 'string',
              minLength: 6,
              description: 'OTP code'
            }
          }
        },
        // Game DTOs
        LatestRoundDto: {
          type: 'object',
          properties: {
            frequency: {
              type: 'integer',
              minimum: 1,
              description: 'Game frequency (optional)'
            }
          }
        },
        PlaceBetDto: {
          type: 'object',
          required: ['digit1', 'digit2', 'digit3', 'amount', 'frequency', 'userId'],
          properties: {
            digit1: {
              type: 'number',
              minimum: 1,
              maximum: 9,
              description: 'First digit (1-9)'
            },
            digit2: {
              type: 'number',
              minimum: 1,
              maximum: 9,
              description: 'Second digit (1-9)'
            },
            digit3: {
              type: 'number',
              minimum: 1,
              maximum: 9,
              description: 'Third digit (1-9)'
            },
            amount: {
              type: 'number',
              minimum: 1,
              description: 'Bet amount'
            },
            frequency: {
              type: 'integer',
              minimum: 1,
              description: 'Game frequency'
            },
            userId: {
              type: 'integer',
              minimum: 1,
              description: 'User ID'
            }
          }
        },
        // Response Data Schemas
        LoginResponseData: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token'
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token'
            },
            expiresIn: {
              type: 'integer',
              description: 'Token expiration time in seconds'
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'User ID'
                },
                email: {
                  type: 'string',
                  description: 'User email'
                },
                username: {
                  type: 'string',
                  description: 'Username'
                },
                firstName: {
                  type: 'string',
                  description: 'First name'
                },
                lastName: {
                  type: 'string',
                  description: 'Last name'
                }
              }
            }
          }
        },
        UserResponseData: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Email verification status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        GameHistoryEntry: {
          type: 'object',
          properties: {
            period: {
              type: 'integer',
              description: 'Game period number'
            },
            gameInterval: {
              type: 'integer',
              description: 'Game interval in seconds'
            },
            startTime: {
              type: 'string',
              format: 'date-time',
              description: 'Game start time'
            },
            endTime: {
              type: 'string',
              format: 'date-time',
              description: 'Game end time'
            },
            winningCode: {
              type: 'string',
              description: 'Winning combination'
            }
          }
        },
        UserBetHistoryEntry: {
          allOf: [
            { $ref: '#/components/schemas/GameHistoryEntry' },
            {
              type: 'object',
              properties: {
                isWin: {
                  type: 'boolean',
                  description: 'Whether the user won this round'
                },
                betAmount: {
                  type: 'number',
                  description: 'Amount bet on this round'
                },
                predictedDigits: {
                  type: 'array',
                  items: {
                    type: 'number'
                  },
                  description: 'User predicted digits'
                }
              }
            }
          ]
        },
        BalanceResponseData: {
          type: 'object',
          properties: {
            balance: {
              type: 'number',
              description: 'Current user balance'
            },
            currency: {
              type: 'string',
              description: 'Currency code'
            }
          }
        },
        BetResponseData: {
          type: 'object',
          properties: {
            betId: {
              type: 'integer',
              description: 'Bet ID'
            },
            userId: {
              type: 'integer',
              description: 'User ID'
            },
            amount: {
              type: 'number',
              description: 'Bet amount'
            },
            predictedDigits: {
              type: 'array',
              items: {
                type: 'number'
              },
              description: 'Predicted digits'
            },
            roundId: {
              type: 'integer',
              description: 'Round ID'
            },
            status: {
              type: 'string',
              enum: ['pending', 'won', 'lost'],
              description: 'Bet status'
            }
          }
        },
        TransactionResponseData: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Transaction ID'
            },
            userId: {
              type: 'integer',
              description: 'User ID'
            },
            type: {
              type: 'string',
              enum: ['deposit', 'withdrawal', 'bet', 'win'],
              description: 'Transaction type'
            },
            amount: {
              type: 'number',
              description: 'Transaction amount'
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
              description: 'Transaction status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction creation date'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/app.ts']
};

export const specs = swaggerJsdoc(options); 