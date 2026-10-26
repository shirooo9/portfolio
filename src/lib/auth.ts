import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
const COOKIE = "portfolio_admin_session";
const MAX_AGE = 8 * 60 * 60;
function secret() { const value = process.env.ADMIN_SESSION_SECRET; if (!value && process.env.NODE_ENV === "production") throw new Error("Admin session is not configured"); return value ?? "development-only-session-secret"; }
function password() { const value = process.env.ADMIN_PASSWORD; if (value) return value; if (process.env.NODE_ENV !== "production" && process.env.ALLOW_DEFAULT_ADMIN_PASSWORD === "true") return "admin123"; throw new Error("Admin password is not configured"); }
function sign(payload: string) { return createHmac("sha256", secret()).update(payload).digest("base64url"); }
export function verifyPassword(candidate: string) { const a = Buffer.from(candidate); const b = Buffer.from(password()); return a.length === b.length && timingSafeEqual(a, b); }
export function createSession() { const expires = Math.floor(Date.now() / 1000) + MAX_AGE; const payload = `${randomBytes(16).toString("base64url")}.${expires}`; return `${payload}.${sign(payload)}`; }
export function verifySession(token: string | undefined) { if (!token) return false; const parts = token.split("."); if (parts.length !== 3 || Number(parts[1]) < Math.floor(Date.now() / 1000)) return false; const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`)); const actual = Buffer.from(parts[2]); return expected.length === actual.length && timingSafeEqual(expected, actual); }
export async function isAdmin() { return verifySession((await cookies()).get(COOKIE)?.value); }
export const sessionCookie = { name: COOKIE, maxAge: MAX_AGE };
