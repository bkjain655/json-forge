/**
 * Minimal fixed-window, in-memory rate limiter.
 *
 * NOTE: state lives in the process memory of a single instance, so it resets on
 * cold start and is not shared across a multi-instance / serverless deployment.
 * The production upgrade is a shared store - Upstash Redis (`@upstash/ratelimit`
 * + `@upstash/redis`) is the drop-in replacement that keeps the same interface.
 */

type Window = { count: number; resetAt: number }

const buckets = new Map<string, Window>()

export interface RateLimitResult {
  success: boolean
  remaining: number
  /** Seconds until the current window resets. */
  retryAfter: number
}

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, retryAfter: Math.ceil(windowMs / 1000) }
  }

  existing.count += 1
  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000))

  if (existing.count > limit) {
    return { success: false, remaining: 0, retryAfter }
  }

  return { success: true, remaining: limit - existing.count, retryAfter }
}

/** Opportunistically drop expired windows so the map cannot grow unbounded. */
export function pruneRateLimitBuckets(): void {
  const now = Date.now()
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key)
  }
}
