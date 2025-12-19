/**
 * Get the base URL of the application
 * Works on both server and client side
 */
export function getBaseUrl(): string {
  // Server-side: use environment variable
  if (typeof window === 'undefined') {
    return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  
  // Client-side: use window.location
  return window.location.origin;
}

/**
 * Get a full URL for a given path
 * @param path - The path to append to the base URL (e.g., '/admin/users')
 * @returns The full URL
 */
export function getUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Get admin route path (relative) or full URL
 * @param route - The admin route (e.g., 'users', 'orders')
 * @param fullUrl - If true, returns full URL; if false, returns relative path (default: false)
 * @returns The admin path or full URL
 */
export function getAdminUrl(route: string = '', fullUrl: boolean = false): string {
  const normalizedRoute = route.startsWith('/') ? route : route ? `/${route}` : '';
  const path = `/admin${normalizedRoute}`;
  
  if (fullUrl) {
    return getUrl(path);
  }
  
  return path;
}

