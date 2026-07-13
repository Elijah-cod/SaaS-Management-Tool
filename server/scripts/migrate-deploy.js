const { spawnSync } = require("node:child_process");
const path = require("node:path");
require("dotenv").config();

const runtimeUrl = process.env.DATABASE_URL;

if (!runtimeUrl) {
  throw new Error("DATABASE_URL is required before migrations can run");
}

const migrationUrl = new URL(process.env.DIRECT_URL ?? runtimeUrl);

// Neon pooler endpoints are ideal at runtime, but schema engines need a direct host.
if (!process.env.DIRECT_URL) {
  migrationUrl.hostname = migrationUrl.hostname.replace("-pooler.", ".");
}

const prismaCli = path.join(
  path.dirname(require.resolve("prisma/package.json")),
  "build",
  "index.js"
);
const result = spawnSync(process.execPath, [prismaCli, "migrate", "deploy"], {
  env: {
    ...process.env,
    DATABASE_URL: migrationUrl.toString(),
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
