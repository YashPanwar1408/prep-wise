# PrepWise

A full-stack interview preparation platform that combines **DSA learning + practice**, **AI-powered resume/ATS workflows**, and **mock interview rooms** (AI + human flows) in one app.

- Frontend: Next.js App Router (TypeScript)
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL (Prisma)

---

## What you can do

- **DSA Learn**: read structured lessons/topics with sidebar navigation.
- **DSA Practice**: browse curated problems, open a solve page, and run/submit solutions via the backend judge.
- **Code execution**:
  - Sandbox-ish runner using **Docker** for Python/JavaScript (optional), with a local fallback.
  - **Judge0** execution engine endpoints (optional) for multi-language runs.
- **Resume**:
  - Upload PDF → extract text client-side → parse into structured resume data.
  - ATS-style scoring & keyword matching (backend endpoints).
  - Resume preview/export flows (React PDF).
- **Interviews**:
  - AI interview sessions with **voice AI** via Vapi.
  - Video rooms and tokens via **GetStream**.
- **Roadmaps & Cheatsheets**: curated content seeded into the DB.

---

## Tech stack

### Frontend (frontend/)
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 + Radix UI primitives
- Clerk authentication
- Zustand + React Hook Form + Zod
- Monaco editor, Markdown rendering + highlighting
- Stream Video SDK + Stream Chat UI
- Vapi Voice AI client
- Prisma Client (server-side)

### Backend (backend/)
- Node.js (CommonJS) + Express
- Prisma ORM (PostgreSQL)
- JWT auth endpoints (backend auth routes)
- Grok (Groq OpenAI-compatible) helper for AI endpoints
- Docker-based judge runner + optional Piston integration
- Judge0 integration endpoints (optional)

---

## Repo structure

- backend/ — Express API, Prisma schema/migrations/seed scripts
- frontend/ — Next.js app (App Router)

See also:
- backend/README.md (backend deep dive)
- frontend/README.md (frontend deep dive)

---

## Prerequisites

- Node.js 18+ (recommended)
- PostgreSQL database (local Docker or hosted)
- Docker Desktop (optional but recommended for code execution sandboxing)
- Accounts/keys (optional, for AI + realtime features): Clerk, Grok, Stream, Vapi

---

## Environment variables

### Backend

1) Copy backend/.env.example → backend/.env
2) Fill values (database + keys)

Key variables used by the backend:
- PORT
- DATABASE_URL, DIRECT_URL
- JWT_SECRET
- GROK_API_KEY, GROK_BASE_URL, GROK_MODEL
- USE_DOCKER, USE_PISTON, JUDGE_CMD_TIMEOUT_MS
- JUDGE0_API_URL, JUDGE0_API_KEY, JUDGE0_API_HOST, JUDGE0_CPU_LIMIT, JUDGE0_MEM_LIMIT

### Frontend

1) Copy frontend/.env.example → frontend/.env.local
2) Fill values (Clerk, Stream, Vapi, Grok, DB)

Key variables used by the frontend:
- NEXT_PUBLIC_API_URL
- DATABASE_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
- GROK_API_KEY, GROK_BASE_URL, GROK_MODEL
- VAPI_API_KEY, NEXT_PUBLIC_VAPI_API_KEY, NEXT_PUBLIC_VAPI_ASSISTANT_ID, VAPI_MODEL
- STREAM_API_KEY, STREAM_SECRET, NEXT_PUBLIC_STREAM_API_KEY

---

## Local development

### 1) Backend

From backend/:

```bash
npm install

# Apply migrations (creates tables)
npm run prisma:migrate

# Optional: seed content
npm run prisma:seed:fullstack

# Dev server
npm run dev
```

Backend defaults to http://localhost:5000

### 2) Frontend

From frontend/:

```bash
npm install
npm run dev
```

Frontend defaults to http://localhost:3000

---

## Docker (backend)

A minimal docker-compose is available in backend/docker-compose.yml:

```bash
cd backend
docker compose up --build
```

Notes:
- This compose file runs the backend container; you still need a Postgres DATABASE_URL reachable from the container.
- The judge runner can mount the Docker socket to run language containers.

---

## Useful scripts

### Backend
- npm run dev — start backend with nodemon
- npm start — start backend
- npm run prisma:generate — generate Prisma client
- npm run prisma:migrate — run migrations
- npm run prisma:seed — seed basic data
- npm run prisma:seed:fullstack — seed full-stack track content
- npm run seed:problems — seed DSA patterns + master 250

### Frontend
- npm run dev — start Next.js dev server
- npm run build — production build
- npm start — start production server
- npm run lint — ESLint

---

## API overview (backend)

- GET /api/health — health check
- /api/auth — registration/login (JWT)
- /api/dsa — lessons/topics/problems
- /api/judge — docker/local runner for submissions
- /api/execution — Judge0-backed execution engine
- /api/ats — resume scoring + keyword matching
- /api/learn — learning tracks + lessons
- /api/roadmaps — roadmaps
- /api/cheatsheets — cheatsheets

---

## Security notes

- Do not commit real secrets. Keep backend/.env and frontend/.env.local untracked.
- The judge’s local execution fallback is not a secure sandbox for untrusted code.

---

## License

No license file is included yet. Add one if you plan to open-source this repository.
