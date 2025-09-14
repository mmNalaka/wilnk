/**
 * Custom error classes for pages module
 */

export class PageNotFoundError extends Error {
  constructor(message = "Page not found") {
    super(message);
    this.name = "PageNotFoundError";
  }
}

export class PageAccessDeniedError extends Error {
  constructor(message = "Access denied to page") {
    super(message);
    this.name = "PageAccessDeniedError";
  }
}

export class InvalidSlugError extends Error {
  constructor(message = "Invalid slug format") {
    super(message);
    this.name = "InvalidSlugError";
  }
}

export class SlugAlreadyExistsError extends Error {
  constructor(message = "Slug already exists") {
    super(message);
    this.name = "SlugAlreadyExistsError";
  }
}

export class PageValidationError extends Error {
  constructor(message = "Page validation failed") {
    super(message);
    this.name = "PageValidationError";
  }
}

/**
 * Error handler for pages operations
 */
export function handlePageError(error: unknown): never {
  if (error instanceof PageNotFoundError) {
    throw error;
  }

  if (error instanceof PageAccessDeniedError) {
    throw error;
  }

  if (error instanceof InvalidSlugError) {
    throw error;
  }

  if (error instanceof SlugAlreadyExistsError) {
    throw error;
  }

  if (error instanceof PageValidationError) {
    throw error;
  }

  // Generic error handling
  if (error instanceof Error) {
    throw new Error(`Page operation failed: ${error.message}`);
  }

  throw new Error("Unknown page operation error");
}
