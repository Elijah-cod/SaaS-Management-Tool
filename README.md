# SaaS Management Tool

Full-stack project management dashboard built with:

- `client/`: Next.js 16, Tailwind CSS 4, Redux Toolkit, RTK Query, Material UI Data Grid
- `server/`: Express, Prisma, PostgreSQL

The current app includes a responsive dashboard shell, Kanban-style home board, task detail drawer, drag-and-drop task movement, and backend-backed task updates for status, assignees, comments, and attachments.

[Live frontend](https://saa-s-management-tool.vercel.app) · [Live API](https://saas-management-tool-api.vercel.app/health) · [Repository](https://github.com/Elijah-cod/SaaS-Management-Tool)

## Architecture

```text
client (Next.js)
  -> app routes
  -> feature modules (tasks, projects, workspace, auth, app-shell)
  -> shared store + RTK Query base API
  -> server (Express API)
server (Express)
  -> feature modules (auth, projects, tasks, users, teams, search)
  -> shared middleware, auth, error handling, security utilities
  -> Prisma
  -> Neon PostgreSQL
```

## Requirements

- Node.js `>=20.9.0`
- npm
- PostgreSQL

## Repository Structure

```text
.
├── client
│   ├── src/app
│   ├── src/features
│   ├── src/shared
│   └── package.json
├── server
│   ├── src/modules
│   ├── src/shared
│   ├── prisma
│   └── package.json
└── README.md
```

## Environment Variables

### Client

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
AUTH_SECRET="replace-with-a-long-random-string"
```

Example file: [`client/.env.local.example`](client/.env.local.example)

### Server

Create `server/.env` from [`server/.env.example`](server/.env.example):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_management?schema=public"
# Optional unpooled connection used by migrations (recommended with Neon)
DIRECT_URL=""
PORT=4000
CLIENT_URL="http://localhost:3000"
API_AUTH_SECRET="replace-with-a-long-random-string"
NODE_ENV="development"
```

Notes:

- `CLIENT_URL` can be a comma-separated list in production if you need multiple allowed origins.
- `DATABASE_URL` must point to a live Postgres instance before running Prisma commands.
- Runtime connections may use Neon's pooled URL. `npm run migrate:deploy` uses `DIRECT_URL` when provided and otherwise converts a Neon pooler hostname to its direct counterpart.

## Local Development

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Prepare the database

```bash
cd server
npx prisma generate
npx prisma migrate dev
npm run seed
```

### 3. Start the backend

```bash
cd server
npm run dev
```

Health check:

```bash
curl http://localhost:4000/health
```

Database readiness check:

```bash
curl http://localhost:4000/ready
```

### 4. Start the frontend

```bash
cd client
npm run dev
```

Open `http://localhost:3000/login`.

After seeding the database, sign in with one of the seeded workspace users:

- `amina@saasmanager.app` / `ChangeMe123!`
- `daniel@saasmanager.app` / `ChangeMe123!`
- `lina@saasmanager.app` / `ChangeMe123!`
- `musa@saasmanager.app` / `ChangeMe123!`
- `grace@saasmanager.app` / `ChangeMe123!`
- `brian@saasmanager.app` / `ChangeMe123!`
- `njeri@saasmanager.app` / `ChangeMe123!`
- `kevin@saasmanager.app` / `ChangeMe123!`

The seed is idempotent: it updates fixtures by stable seed keys and does not
delete projects, tasks, comments, or attachments created by workspace users.

## Useful Commands

### Client

```bash
cd client
npm run dev
npm run lint
npm run typecheck
npm run build
```

### Server

```bash
cd server
npm run dev
npm run typecheck
npm run build
npm run seed
npm run test
```

## Current API Surface

### Read endpoints

- `GET /health`
- `GET /projects`
- `GET /tasks`
- `GET /tasks?projectId=<id>`
- `GET /users`
- `GET /teams`
- `GET /search?q=<query>`

### Authentication endpoints

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

### Task interaction endpoints

- `PATCH /tasks/:taskId/status`
- `PATCH /tasks/:taskId/assignee`
- `POST /tasks/:taskId/comments`
- `POST /tasks/:taskId/attachments`

## Production Readiness Checklist

Already in place:

- environment-based server config
- health endpoint
- CORS allowlist
- Helmet
- centralized API error handling
- login rate limiting
- request logging with Morgan
- typed client and server build/typecheck commands
- separate frontend/backend env files
- feature-oriented client and server module boundaries
- backend-backed task board interactions
- persisted Prisma-backed users with hashed passwords
- NextAuth credentials login backed by the Express auth API
- bearer-token protection on dashboard API routes
- role-based authorization on write actions
- request validation on auth, project, and task mutation endpoints
- server integration tests for auth and route protection
- database-aware readiness checks
- Vercel Express/Fluid Compute deployment configuration
- Railway deployment configuration as an alternative runtime
- platform-managed production secrets

Still recommended before shipping publicly:

- expand server integration coverage beyond authentication and route protection
- add automated tests for core client workflows
- move attachment handling from metadata-only to real object storage
- add database-backed activity/audit history
- add CI for `lint`, `typecheck`, and `build`
- automate database migrations in CI/CD with an explicit approval gate

## Deployment Guidance

### Frontend

The production frontend is the Vercel project `saa-s-management-tool` with the repository root directory set to `client`.

Required env:

- `NEXT_PUBLIC_API_BASE_URL=https://saas-management-tool-api.vercel.app`
- `AUTH_SECRET=<long-random-secret>`

### Backend

The production backend is the Vercel project `saas-management-tool-api` with the repository root directory set to `server`. [`server/vercel.json`](server/vercel.json) selects the native Express framework and Fluid Compute. Both projects are connected to this repository and deploy from `main`.

Required env:

- `DATABASE_URL=<pooled-neon-connection-string>`
- `CLIENT_URL=https://saa-s-management-tool.vercel.app`
- `API_AUTH_SECRET=<long-random-secret>`

Verify a release with:

```bash
curl https://saas-management-tool-api.vercel.app/health
curl https://saas-management-tool-api.vercel.app/ready
```

Run schema migrations as an explicit release step before deploying code that depends on them:

```bash
cd server
DIRECT_URL="<unpooled-neon-connection-string>" npm run migrate:deploy
```

Railway remains supported as an alternative backend runtime. Configure it with:

- Root directory: `/server`
- Config file path: `/server/railway.json`
- Required variables: `DATABASE_URL`, `CLIENT_URL`, `API_AUTH_SECRET`, `NODE_ENV=production`
- Optional migration variable: `DIRECT_URL` (the unpooled Neon connection string)

If Railway is used, set the frontend's `NEXT_PUBLIC_API_BASE_URL` to its generated HTTPS domain and redeploy the frontend.

### Database

Use managed PostgreSQL in production:

- Neon
- Supabase Postgres
- Railway Postgres
- Render Postgres

## Known Constraints

- task attachments are currently metadata-only, not binary file uploads
- task assignee persistence currently supports a single stored assignee even though the UI can be expanded later to true multi-assignee support
- active sessions rotate short-lived API credentials through a refresh token kept inside the encrypted, HTTP-only Auth.js session cookie

## Recommended Next Steps

1. Expand integration tests for task mutations and authorization boundaries.
2. Add real file upload storage for attachments.
3. Add refresh-token revocation for password changes and account suspension.
4. Add CI quality gates and approved production migration automation.
