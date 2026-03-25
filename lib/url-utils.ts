/**
 * Prefer the upload API's absolute URL when present so stored values work in
 * RSS, email, crawlers, and strict contexts; fall back to site-relative `/uploads/...`.
 */
export function pickUploadedAssetUrl(
  data: { url?: string; publicUrl?: string } | null | undefined
): string {
  if (!data) return "";
  return (data.publicUrl || data.url || "").trim();
}

/**
 * Resolve DB-stored site paths (`/uploads/...`) or protocol-relative URLs to an absolute URL.
 * On the client, uses `window.location.origin` so localhost and production both resolve correctly.
 * Pass `baseOverride` on the server (e.g. layout metadata / JSON-LD) when you have a canonical base.
 */
export function resolveAssetUrl(
  href: string | null | undefined,
  baseOverride?: string
): string {
  if (href == null || String(href).trim() === "") return "";
  const raw = String(href).trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const base =
    baseOverride ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "";
  if (!base) return path;
  return `${base.replace(/\/$/, "")}${path}`;
}

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

