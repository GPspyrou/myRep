// lib/rateLimiter.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '10 m'), // 5 requests per 10 minutes
});

export async function applyRateLimit(ip: string): Promise<{ success: boolean }> {
  return await ratelimit.limit(ip);
}
