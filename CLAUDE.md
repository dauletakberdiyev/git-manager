# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitManage is a Kanban board tool that integrates with GitHub. Users authenticate via GitHub OAuth, import their repos as projects, create tasks that auto-generate feature branches, and see tasks auto-completed when PRs are merged via webhooks.

**Stack:** NestJS (backend) + React/Vite (frontend) + PostgreSQL (Prisma ORM) + OpenAI + Octokit

## Development Setup

```bash
# Start PostgreSQL
docker-compose up -d

# Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev       # runs on :3000

# Frontend
cd frontend
npm install
npm run dev             # runs on :5173
```

Copy `.env.example` to `.env` and fill in: `DATABASE_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `JWT_SECRET`, `OPENAI_API_KEY`.

## Common Commands

```bash
# Backend
npm run build           # compile TypeScript
npm run lint            # ESLint
npm run test            # unit tests (Jest)
npm run test:e2e        # end-to-end tests
npm run test -- --testPathPattern=tasks  # run single test file

# Frontend
npm run build           # Vite production build
npm run lint            # ESLint
```

## Architecture

### Backend (NestJS, `/backend/src/`)

Feature-based modules, each with controller/service/dto pattern:

- **auth** — GitHub OAuth via passport-github2, issues JWT on callback; `JwtAuthGuard` protects routes
- **users** — user record management
- **projects** — CRUD for projects; imports repos from GitHub via `GithubService`
- **tasks** — creates tasks and auto-creates a `feature/{slug}` branch on GitHub via `GithubService`
- **github** — Octokit wrapper (`getUserRepos`, `getDefaultBranchSha`, `createBranch`)
- **ai** — OpenAI gpt-4o-mini integration; `POST /ai/breakdown` returns 3–6 subtask suggestions
- **webhooks** — receives GitHub `pull_request` events; verifies HMAC-SHA256 signature; marks task DONE when PR merged
- **prisma** — singleton `PrismaService`

Global API prefix: `/api`. CORS enabled. `ValidationPipe` applied globally.

### Frontend (React + Vite, `/frontend/src/`)

- **Routing** (`App.tsx`) — public: `/login`, `/auth/callback`; protected: `/projects`, `/board/:projectId`
- **Auth flow** — `authStore.ts` (Zustand, persisted to localStorage) holds JWT; `api/client.ts` (Axios) attaches it as Bearer token and auto-logouts on 401
- **BoardPage** — dnd-kit Kanban with three columns (TODO / IN_PROGRESS / DONE); optimistic UI on drag, PATCH on drop
- **CreateTaskModal** — calls `POST /ai/breakdown` to suggest subtasks before creation

### Database (Prisma, `/backend/prisma/schema.prisma`)

```
User → Project (one-to-many)
Project → Task (one-to-many, cascade delete)
Task.status: TODO | IN_PROGRESS | DONE
Task.branchName: used to match PRs from webhooks
```

Unique constraint on `(userId, repoId)` prevents duplicate project imports.

## Key Integration Points

- **GitHub OAuth callback** redirects to `{FRONTEND_URL}/auth/callback?token=<jwt>`
- **Webhook secret** must match `GITHUB_WEBHOOK_SECRET` env var; GitHub sends `X-Hub-Signature-256`
- **Branch creation** happens at task creation time; failures are non-blocking (task still saved)
- **AI breakdown** returns a JSON array from OpenAI; frontend parses and displays before task save
