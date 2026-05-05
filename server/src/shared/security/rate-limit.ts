import type { RequestHandler } from "express";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message: string;
  keyPrefix?: string;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export const createRateLimiter = ({
  windowMs,
  max,
  message,
  keyPrefix = "global",
}: RateLimitOptions): RequestHandler => {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${req.ip ?? "unknown"}`;
    const currentBucket = rateLimitBuckets.get(key);

    if (!currentBucket || currentBucket.resetAt <= now) {
      rateLimitBuckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    if (currentBucket.count >= max) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((currentBucket.resetAt - now) / 1000)
      );
      res.setHeader("retry-after", String(retryAfterSeconds));
      return res.status(429).json({ message });
    }

    currentBucket.count += 1;
    rateLimitBuckets.set(key, currentBucket);
    return next();
  };
};
