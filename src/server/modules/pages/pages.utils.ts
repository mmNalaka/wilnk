import { nanoid } from "nanoid";

/**
 * Generate a unique slug from a title
 */
export function generateSlug(title?: string): string {
  if (!title) {
    return nanoid(6);
  }

  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseSlug}-${nanoid(6)}`;
}

/**
 * Generate a duplicate slug from an existing slug
 */
export function generateDuplicateSlug(originalSlug: string): string {
  const baseSlug = originalSlug.replace(/-[a-zA-Z0-9]{6}$/, "");
  return `${baseSlug}-copy-${nanoid(6)}`;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 1 && slug.length <= 100;
}

/**
 * Sanitize title for safe storage
 */
export function sanitizeTitle(title: string): string {
  return title.trim().substring(0, 200);
}

/**
 * Check if a page is published
 */
export function isPagePublished(status: string, publishedAt: Date | null): boolean {
  return status === "published" || !!publishedAt;
}

/**
 * Get page status display text
 */
export function getPageStatusText(status: string, publishedAt: Date | null): string {
  if (isPagePublished(status, publishedAt)) {
    return "Published";
  }
  
  switch (status) {
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return "Unknown";
  }
}
