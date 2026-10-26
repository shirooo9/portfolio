import test from "node:test";
import assert from "node:assert/strict";
import { createSession, verifyPassword, verifySession } from "../src/lib/auth";
import { sameOrigin } from "../src/lib/request-security";
import { checkLoginRateLimit, resetLoginRateLimit } from "../src/lib/login-rate-limit";

test("auth rejects missing and wrong passwords without exposing credentials", () => {
  process.env.ADMIN_PASSWORD = "qa-password";
  assert.equal(verifyPassword(""), false);
  assert.equal(verifyPassword("wrong"), false);
  assert.equal(verifyPassword("qa-password"), true);
});

test("sessions verify, reject tampering, and reject missing tokens", () => {
  process.env.ADMIN_SESSION_SECRET = "qa-session-secret";
  const session = createSession();
  assert.equal(verifySession(session), true);
  assert.equal(verifySession(undefined), false);
  assert.equal(verifySession(`${session}tampered`), false);
});

test("login rate limit blocks after the configured number of attempts", () => {
  process.env.LOGIN_RATE_LIMIT_MAX = "2";
  process.env.LOGIN_RATE_LIMIT_WINDOW_SECONDS = "60";
  const key = "qa-rate-limit";
  resetLoginRateLimit(key);
  assert.equal(checkLoginRateLimit(key).allowed, true);
  assert.equal(checkLoginRateLimit(key).allowed, true);
  assert.equal(checkLoginRateLimit(key).allowed, false);
  resetLoginRateLimit(key);
  delete process.env.LOGIN_RATE_LIMIT_MAX;
  delete process.env.LOGIN_RATE_LIMIT_WINDOW_SECONDS;
});

test("write requests accept same-origin or no Origin and reject another origin", () => {
  const url = "http://localhost:3000/api/admin/data";
  assert.equal(sameOrigin(new Request(url)), true);
  assert.equal(sameOrigin(new Request(url, { headers: { Origin: "http://localhost:3000" } })), true);
  assert.equal(sameOrigin(new Request(url, { headers: { Origin: "https://attacker.example" } })), false);
});
