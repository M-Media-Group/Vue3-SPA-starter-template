/**
 * Represents a unified error structure.
 * @note - in this template this is not used. You need to define your own error formatting and can unify errors from servers, axios, and zod under the suggested format below.
 */
export interface UnifiedError {
  /** A general category for the error (e.g., 'network', 'server', 'validation', 'unknown'). */
  type: "network" | "server" | "validation" | "unknown";
  /** A user-friendly message describing the error. */
  message: string;
  /** Optional details, especially for validation errors (e.g., field-specific messages). */
  details?: Record<string, string[] | string | object | undefined>;
  /** The HTTP status code, if applicable. */
  status?: number;
  /** The original error object. */
  originalError: unknown; // Keep a reference to the original error
  /** The operation during which the error occurred. */
  operation: string;
}

export function isUnifiedError(error: unknown): error is UnifiedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error &&
    "originalError" in error
  );
}

export function assertIsUnifiedError(
  error: unknown
): asserts error is UnifiedError {
  if (!isUnifiedError(error)) {
    throw error;
  }
}
