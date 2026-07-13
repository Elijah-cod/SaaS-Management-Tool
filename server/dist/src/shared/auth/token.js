"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.createAccessToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../../config/env");
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;
const encodeBase64Url = (value) => Buffer.from(value).toString("base64url");
const decodeBase64Url = (value) => Buffer.from(value, "base64url").toString("utf8");
const createSignature = (value) => crypto_1.default.createHmac("sha256", env_1.env.apiAuthSecret).update(value).digest("base64url");
const hasMatchingSignature = (signature, expectedSignature) => {
    const providedBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (providedBuffer.length !== expectedBuffer.length) {
        return false;
    }
    return crypto_1.default.timingSafeEqual(providedBuffer, expectedBuffer);
};
const createAccessToken = (user) => {
    const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = encodeBase64Url(JSON.stringify({
        sub: String(user.userId),
        email: user.email,
        role: user.role,
        exp: Date.now() + TOKEN_TTL_MS,
    }));
    const signature = createSignature(`${header}.${payload}`);
    return `${header}.${payload}.${signature}`;
};
exports.createAccessToken = createAccessToken;
const verifyAccessToken = (token) => {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) {
        return null;
    }
    const expectedSignature = createSignature(`${header}.${payload}`);
    if (!hasMatchingSignature(signature, expectedSignature)) {
        return null;
    }
    try {
        const parsedHeader = JSON.parse(decodeBase64Url(header));
        const parsedPayload = JSON.parse(decodeBase64Url(payload));
        const userId = Number(parsedPayload.sub);
        if (parsedHeader.alg !== "HS256" ||
            parsedHeader.typ !== "JWT" ||
            !Number.isInteger(userId) ||
            userId <= 0 ||
            typeof parsedPayload.email !== "string" ||
            typeof parsedPayload.role !== "string" ||
            typeof parsedPayload.exp !== "number" ||
            parsedPayload.exp <= Date.now()) {
            return null;
        }
        return parsedPayload;
    }
    catch {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
//# sourceMappingURL=token.js.map