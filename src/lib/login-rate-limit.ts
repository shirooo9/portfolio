const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkLoginRateLimit(key: string) {
  const now = Date.now();
  const max = Math.max(1, Number(process.env.LOGIN_RATE_LIMIT_MAX ?? 5));
  const windowMs = Math.max(1000, Number(process.env.LOGIN_RATE_LIMIT_WINDOW_SECONDS ?? 900) * 1000);
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= max) return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function resetLoginRateLimit(key: string) { attempts.delete(key); }
