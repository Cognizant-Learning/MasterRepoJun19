/**
 * Mock API Error Handling Utilities
 * 
 * This module provides consistent error handling for the mock API responses
 * Both the MSW browser mocks and Node.js mock server can use these utilities
 */

// Standard error types that match backend error codes
export enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

// Map of error types to HTTP status codes
export const errorStatusMap = {
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.BAD_REQUEST]: 400,
  [ErrorType.UNAUTHORIZED]: 401,
  [ErrorType.FORBIDDEN]: 403,
  [ErrorType.INTERNAL_ERROR]: 500,
  [ErrorType.VALIDATION_ERROR]: 422,
  [ErrorType.NETWORK_ERROR]: 503
};

// Standard error response structure
export interface ErrorResponse {
  success: false;
  error: {
    type: ErrorType;
    message: string;
    details?: any;
  };
}

// Create a standard error response
export function createErrorResponse(type: ErrorType, message: string, details?: any): ErrorResponse {
  return {
    success: false,
    error: {
      type,
      message,
      ...(details ? { details } : {})
    }
  };
}

// Create a not found error
export function notFoundError(message: string = 'Resource not found'): ErrorResponse {
  return createErrorResponse(ErrorType.NOT_FOUND, message);
}

// Create a bad request error
export function badRequestError(message: string = 'Invalid request', details?: any): ErrorResponse {
  return createErrorResponse(ErrorType.BAD_REQUEST, message, details);
}

// Create a validation error
export function validationError(message: string = 'Validation error', details?: any): ErrorResponse {
  return createErrorResponse(ErrorType.VALIDATION_ERROR, message, details);
}

// Create an unauthorized error
export function unauthorizedError(message: string = 'Unauthorized'): ErrorResponse {
  return createErrorResponse(ErrorType.UNAUTHORIZED, message);
}

// Create a forbidden error
export function forbiddenError(message: string = 'Forbidden'): ErrorResponse {
  return createErrorResponse(ErrorType.FORBIDDEN, message);
}

// Create an internal server error
export function internalError(message: string = 'Internal server error'): ErrorResponse {
  return createErrorResponse(ErrorType.INTERNAL_ERROR, message);
}

// Create a network error
export function networkError(message: string = 'Network error'): ErrorResponse {
  return createErrorResponse(ErrorType.NETWORK_ERROR, message);
}

// Get the status code for a given error type
export function getStatusCodeForError(type: ErrorType): number {
  return errorStatusMap[type] || 500;
}

// Create a standard success response
export function createSuccessResponse<T>(data: T, count?: number): {
  success: true;
  data: T;
  count?: number;
} {
  return {
    success: true,
    data,
    ...(count !== undefined ? { count } : {})
  };
}
