# SaaS Management Tool

Full-stack project management dashboard built with:

- `client/`: Next.js 16, Tailwind CSS 4, Redux Toolkit, RTK Query, Material UI Data Grid
- `server/`: Express, Prisma, PostgreSQL

The current app includes a responsive dashboard shell, Kanban-style home board, task detail drawer, drag-and-drop task movement, and backend-backed task updates for status, assignees, comments, and attachments.

## Architecture

```text
client (Next.js)
  -> RTK Query
  -> server (Express API)
  -> Prisma
  -> PostgreSQL
```

## Requirements

- Node.js `>=20.9.0`
- npm
- PostgreSQL

## Repository Structure

```text
.
├── client
│   ├── src
│   └── package.json
├── server
│   ├── prisma
│   ├── src
│   └── package.json
└── README.md
```

## Environment Variables

### Client

Create [client/.env.local](/Users/elijah/Documents/Projects/SaaS-Management-Tool/client/.env.local):

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
AUTH_SECRET="replace-with-a-long-random-string"
```

Example file: [client/.env.local.example](/Users/elijah/Documents/Projects/SaaS-Management-Tool/client/.env.local.example)

### Server

Create `server/.env` from [server/.env.example](/Users/elijah/Documents/Projects/SaaS-Management-Tool/server/.env.example):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_management?schema=public"
PORT=4000
CLIENT_URL="http://localhost:3000"
API_AUTH_SECRET="replace-with-a-long-random-string"
NODE_ENV="development"
```

Notes:

- `CLIENT_URL` can be a comma-separated list in production if you need multiple allowed origins.
- `DATABASE_URL` must point to a live Postgres instance before running Prisma commands.

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
- request logging with Morgan
- typed client and server build/typecheck commands
- separate frontend/backend env files
- backend-backed task board interactions
- persisted Prisma-backed users with hashed passwords
- NextAuth credentials login backed by the Express auth API
- bearer-token protection on dashboard API routes
- role-based authorization on write actions
- request validation on auth, project, and task mutation endpoints
- server integration tests for auth and route protection

Still recommended before shipping publicly:

- add request validation with `zod`
- add automated tests for server routes and core client flows
- move attachment handling from metadata-only to real object storage
- add database-backed activity/audit history
- add CI for `lint`, `typecheck`, and `build`
- add Dockerfiles or deployment manifests
- add production secrets management

## Deployment Guidance

### Frontend

Deploy `client/` to a Next.js-friendly platform such as:

- Vercel
- Netlify

Required env:

- `NEXT_PUBLIC_API_BASE_URL`

### Backend

Deploy `server/` to a Node platform such as:

- Railway
- Render
- Fly.io

Required env:

- `DATABASE_URL`
- `PORT`
- `CLIENT_URL`
- `NODE_ENV=production`

Production server start flow:

```bash
npm install
npx prisma generate
npm run build
npm run start
```

### Database

Use managed PostgreSQL in production:

- Neon
- Supabase Postgres
- Railway Postgres
- Render Postgres

## Known Constraints

- task attachments are currently metadata-only, not binary file uploads
- task assignee persistence currently supports a single stored assignee even though the UI can be expanded later to true multi-assignee support
- the current API token is a signed bearer token and not yet a rotating refresh-token/session pair

## Recommended Next Steps

1. Add request validation and integration tests for auth and task flows.
2. Add real file upload storage for attachments.
3. Upgrade bearer-token auth to refresh-token or session-based rotation.
4. Add CI and deployment configs.
