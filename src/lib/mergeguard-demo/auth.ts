/**
 * Auth middleware. requireAuth was non-nullable; now returns User | null
 * to support the new public webhook endpoint that intentionally skips
 * authentication.
 */
import type { Request } from "express";

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
}

/**
 * Behavioral change: previously returned User and threw on missing token.
 * Now returns null when no token is present so the billing webhook
 * handler can opt in to unauthenticated requests via HMAC verification
 * instead.
 *
 * Callers must null-check the result.
 */
export function requireAuth(req: Request): User | null {
  const token = req.headers["authorization"]?.toString().replace(/^Bearer /, "");
  if (!token) {
    return null;  // was: throw new UnauthorizedError("missing token");
  }
  return verifyToken(token);
}

export function verifyToken(token: string): User | null {
  // ... JWT verification ...
  return { id: "u1", email: "demo@example.com", is_admin: false };
}

/**
 * Decorator-style auth check. Routes that need auth import this.
 */
export function isAuthenticated(req: Request): boolean {
  return requireAuth(req) !== null;
}
