/**
 * Utility functions for date and timezone handling
 */

/**
 * Get current time in UTC format for consistent database operations
 * @returns Date object in UTC
 */
export function getCurrentUTCTime(): Date {
  const now = new Date();
  return new Date(now.toISOString());
}

/**
 * Convert a date to UTC format
 * @param date - Date to convert
 * @returns Date object in UTC
 */
export function toUTC(date: Date): Date {
  return new Date(date.toISOString());
}

/**
 * Format date for logging purposes
 * @param date - Date to format
 * @returns Formatted date object with different formats
 */
export function formatDateForLogging(date: Date): {
  iso: string;
  local: string;
  utc: string;
} {
  return {
    iso: date.toISOString(),
    local: date.toString(),
    utc: date.toUTCString(),
  };
}

/**
 * Check if a date is between two other dates (inclusive)
 * @param date - Date to check
 * @param start - Start date
 * @param end - End date
 * @returns boolean
 */
export function isDateBetween(date: Date, start: Date, end: Date): boolean {
  const utcDate = toUTC(date);
  const utcStart = toUTC(start);
  const utcEnd = toUTC(end);

  return utcDate >= utcStart && utcDate <= utcEnd;
}

/**
 * Add minutes to a date
 * @param date - Base date
 * @param minutes - Minutes to add
 * @returns New date
 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}
