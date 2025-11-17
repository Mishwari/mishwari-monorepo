/**
 * Get Arabic time period name based on hour (0-23)
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Arabic period name
 */
export function getArabicTimePeriod(hour: number): string {
  if (hour >= 3 && hour < 6) return 'فجراً';
  if (hour >= 6 && hour < 12) return 'صباحاً';
  if (hour >= 12 && hour < 17) return 'ظهراً';
  if (hour >= 17 && hour < 20) return 'مساءاً';
  return 'ليلاً';
}

/**
 * Convert ISO date string to readable Arabic time with period
 * @param isoString - ISO date string
 * @returns Formatted time string (e.g., "2:30 مساءاً")
 */
export function convertToReadableTime(isoString: string): string {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = getArabicTimePeriod(hours);

  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr} ${period}`;
}
