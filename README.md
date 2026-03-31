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
```

Example file: [client/.env.local.example](/Users/elijah/Documents/Projects/SaaS-Management-Tool/client/.env.local.example)

### Server

Create `server/.env` from [server/.env.example](/Users/elijah/Documents/Projects/SaaS-Management-Tool/server/.env.example):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_management?schema=public"
PORT=4000
CLIENT_URL="http://localhost:3000"
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

Open `http://localhost:3000/home`.

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

Still recommended before shipping publicly:

- replace the legacy `cognitoId` field in Prisma with a non-AWS auth model
- add authentication and authorization
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
- auth is not production-complete yet

## Recommended Next Steps

1. Replace the legacy auth/user schema with a non-AWS production model.
2. Add request validation and integration tests.
3. Add real file upload storage for attachments.
4. Add CI and deployment configs.
