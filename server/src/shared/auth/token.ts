import crypto from "crypto";
import { env } from "../../config/env";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;

export type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

const encodeBase64Url = (value: string) =>
  Buffer.from(value).toString("base64url");

const decodeBase64Url = (value: string) =>
  Buffer.from(value, "base64url").toString("utf8");

const createSignature = (value: string) =>
  crypto.createHmac("sha256", env.apiAuthSecret).update(value).digest("base64url");

const hasMatchingSignature = (signature: string, expectedSignature: string) => {
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};

export const createAccessToken = (user: {
  userId: number;
  email: string;
  role: string;
}) => {
  const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: String(user.userId),
      email: user.email,
      role: user.role,
      exp: Date.now() + TOKEN_TTL_MS,
    } satisfies TokenPayload)
  );
  const signature = createSignature(`${header}.${payload}`);

  return `${header}.${payload}.${signature}`;
};

export const verifyAccessToken = (token: string) => {
  const [header, payload, signature] = token.split(".");

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(`${header}.${payload}`);

  if (!hasMatchingSignature(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(decodeBase64Url(payload)) as TokenPayload;

    if (parsedPayload.exp <= Date.now()) {
      return null;
    }

    return parsedPayload;
  } catch {
    return null;
  }
};
