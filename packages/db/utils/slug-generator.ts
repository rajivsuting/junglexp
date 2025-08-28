/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @param options - Options for slug generation
 * @returns A URL-friendly slug
 */
export function generateSlug(
  text: string,
  options: {
    separator?: string;
    lowercase?: boolean;
    removeStopWords?: boolean;
    maxLength?: number;
  } = {}
): string {
  const {
    separator = "_",
    lowercase = true,
    removeStopWords = false,
    maxLength = 60,
  } = options;

  // Common stop words to remove (optional)
  const stopWords = removeStopWords
    ? [
        "a",
        "an",
        "and",
        "are",
        "as",
        "at",
        "be",
        "by",
        "for",
        "from",
        "has",
        "he",
        "in",
        "is",
        "it",
        "its",
        "of",
        "on",
        "that",
        "the",
        "to",
        "was",
        "will",
        "with",
      ]
    : [];

  let slug = text
    // Convert to lowercase if specified
    .toLowerCase()
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Replace special characters with spaces
    .replace(/[^\w\s-]/g, " ")
    // Replace multiple spaces with single space
    .replace(/\s+/g, " ")
    // Trim whitespace
    .trim()
    // Split into words
    .split(" ")
    // Remove stop words if specified
    .filter((word) => !removeStopWords || !stopWords.includes(word))
    // Filter out empty words
    .filter((word) => word.length > 0)
    // Join with separator
    .join(separator)
    // Remove multiple consecutive separators
    .replace(new RegExp(`${separator}+`, "g"), separator)
    // Remove leading/trailing separators
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");

  // Truncate if maxLength is specified
  if (maxLength && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Don't cut in the middle of a word if possible
    const lastSeparatorIndex = slug.lastIndexOf(separator);
    if (lastSeparatorIndex > maxLength * 0.8) {
      slug = slug.substring(0, lastSeparatorIndex);
    }
  }

  return slug;
}

/**
 * Generate a unique slug by appending a number if the base slug already exists
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @param separator - Separator to use between slug and number
 * @returns A unique slug
 */
export function generateUniqueSlug(
  baseSlug: string,
  existingSlugs: string[],
  separator: string = "-"
): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}${separator}${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Generate a slug from a place name with coordinates for uniqueness
 * @param name - The place name
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param existingSlugs - Array of existing slugs
 * @returns A unique slug for the place
 */
export function generatePlaceSlug(
  name: string,
  latitude: number,
  longitude: number,
  existingSlugs: string[] = []
): string {
  // Generate base slug from name
  const baseSlug = generateSlug(name, {
    separator: "-",
    lowercase: true,
    removeStopWords: true,
    maxLength: 40,
  });

  // Create a coordinate-based suffix for uniqueness
  const coordSuffix =
    `${Math.abs(latitude).toFixed(2)}-${Math.abs(longitude).toFixed(2)}`
      .replace(/\./g, "")
      .replace(/-/g, "");

  // Combine base slug with coordinate suffix
  const fullSlug = `${baseSlug}-${coordSuffix}`;

  // Ensure uniqueness
  return generateUniqueSlug(fullSlug, existingSlugs);
}

/**
 * Generate a simple slug from text (basic version)
 * @param text - The text to convert
 * @returns A simple slug
 */
export function simpleSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Validate if a slug is valid
 * @param slug - The slug to validate
 * @returns True if the slug is valid
 */
export function isValidSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  // Should not contain consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}
