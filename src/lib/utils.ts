/**
 * Registration code generator.
 * Format: PRIDE-[COMP_CODE]-[YYYYMMDD]-[RANDOM6]
 * Never reveals internal DB IDs.
 */
export function generateRegistrationCode(competitionSlug: string): string {
  const prefix = competitionSlug === 'desain-kemasan' ? 'DK' : 'VL';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).toUpperCase().slice(2, 8);
  return `PRIDE-${prefix}-${date}-${random}`;
}

/**
 * Validates an email address format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates an Indonesian phone number format.
 */
export function isValidPhone(phone: string): boolean {
  return /^(\+62|0)[0-9]{8,13}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitizes a string by trimming and removing control characters.
 */
export function sanitizeString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Formats a currency amount in IDR.
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date in Jakarta timezone.
 */
export function formatJakartaDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    ...options,
  });
}

/**
 * Formats a datetime in Jakarta timezone.
 */
export function formatJakartaDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Rate limiting helper — returns whether a request should be rate limited.
 * Uses a simple in-memory map for dev; in production use Redis/Upstash.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count++;
  return false;
}
