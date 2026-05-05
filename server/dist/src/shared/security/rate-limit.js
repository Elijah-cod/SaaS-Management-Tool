"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const rateLimitBuckets = new Map();
const createRateLimiter = ({ windowMs, max, message, keyPrefix = "global", }) => {
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
            const retryAfterSeconds = Math.max(1, Math.ceil((currentBucket.resetAt - now) / 1000));
            res.setHeader("retry-after", String(retryAfterSeconds));
            return res.status(429).json({ message });
        }
        currentBucket.count += 1;
        rateLimitBuckets.set(key, currentBucket);
        return next();
    };
};
exports.createRateLimiter = createRateLimiter;
//# sourceMappingURL=rate-limit.js.map