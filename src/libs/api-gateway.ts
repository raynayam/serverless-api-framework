import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ZodError } from 'zod';

export type ApiResponse<T = any> = {
  statusCode: number;
  body: string;
  headers: {
    [header: string]: string | number | boolean;
  };
};

/**
 * Format the API response with standardized headers
 */
export const formatJSONResponse = <T>(response: T, statusCode = 200): ApiResponse<T> => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};

/**
 * Handle API errors with proper status codes
 */
export const formatErrorResponse = (error: Error | ZodError | any): ApiResponse => {
  console.error(error);

  // Handle different error types
  if (error instanceof ZodError) {
    return formatJSONResponse(
      {
        success: false,
        message: 'Validation error',
        errors: error.errors,
      },
      400
    );
  }

  // Handle HTTP errors with status codes
  if (error.statusCode) {
    return formatJSONResponse(
      {
        success: false,
        message: error.message,
      },
      error.statusCode
    );
  }

  // Default error handling
  return formatJSONResponse(
    {
      success: false,
      message: error.message || 'Internal server error',
    },
    error.statusCode || 500
  );
};

/**
 * Get request parameters in a type-safe way
 */
export const getPathParameter = (
  event: APIGatewayProxyEvent,
  param: string
): string | undefined => {
  return event.pathParameters?.[param];
};

/**
 * Get query string parameters in a type-safe way
 */
export const getQueryParameter = (
  event: APIGatewayProxyEvent,
  param: string
): string | undefined => {
  return event.queryStringParameters?.[param];
};

/**
 * Extract user data from JWT claims in the authorizer context
 */
export const getUserFromEvent = (event: APIGatewayProxyEvent): { id: string; email: string } | null => {
  const claims = event.requestContext?.authorizer?.claims;
  if (!claims) return null;

  return {
    id: claims.sub,
    email: claims.email,
  };
}; 