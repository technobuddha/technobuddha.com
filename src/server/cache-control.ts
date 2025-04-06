const isDevelopment = process.env.NODE_ENV !== 'production';

export function cacheControl(days = 0): string {
  const seconds = days * 24 * 60 * 60;

  if (seconds === 0 || isDevelopment) {
    return 'public, no-cache, no-store, must-revalidate';
  }

  return `public, max-age=${seconds}`;
}
