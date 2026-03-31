const requireEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const parseClientOrigins = (value: string) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? "4000"),
  databaseUrl: requireEnv("DATABASE_URL", process.env.NODE_ENV === "production" ? undefined : "postgresql://postgres:postgres@localhost:5432/project_management?schema=public"),
  apiAuthSecret: requireEnv(
    "API_AUTH_SECRET",
    process.env.NODE_ENV === "production"
      ? undefined
      : "development-api-auth-secret"
  ),
  clientOrigins: parseClientOrigins(
    requireEnv(
      "CLIENT_URL",
      process.env.NODE_ENV === "production"
        ? undefined
        : "http://localhost:3000"
    )
  ),
};

if (Number.isNaN(env.port)) {
  throw new Error("PORT must be a valid number");
}
