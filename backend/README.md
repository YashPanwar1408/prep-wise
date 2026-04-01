# PrepWise Backend

This is the **backend API** for the PrepWise DSA + interview platform. It is a Node.js / Express service with Prisma for database access and several AI‑powered services (ATS resume analysis, interview helpers, code judge).

This README describes all folders and main files so another AI or developer can understand the backend without access to the full codebase.

> Date of snapshot: **2026‑02‑23**

---

## Tech Stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express 4
- **ORM:** Prisma (`@prisma/client`, `prisma`)
- **Auth:** JSON Web Tokens (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **AI:** Grok API for ATS and interview helpers, custom ATS scoring logic in `ai/ats.js`
- **File Uploads:** `multer` for handling uploaded files (PDF resumes, etc.)
- **PDF Processing:** `pdf-parse` (currently used only in older/legacy flows)
- **Other:** `cors`, `dotenv`, `uuid`, `zod`

---

## Running the Backend

From `backend/`:

```bash
npm install

# Development (auto‑restart with nodemon)
npm run dev

# Production
npm start
```

The server listens on `PORT` (default `5000`) and exposes all routes under `/api/*`.

Environment variables (minimum):

```env
PORT=5000
JWT_SECRET=your-secret-key
DATABASE_URL=postgres://...   # or other Prisma‑supported DB
GROK_API_KEY=...            # for Grok API calls
```

> The Judge service may also require Docker to be installed and running if you enable container‑based execution.

---

## Top‑Level Files and Folders

- `.env` – Local environment variables for development.
- `ai/` – AI‑related utilities (currently ATS scorer).
- `data/` – Static JSON datasets for seed/enrichment (courses, roadmaps, etc.).
- `docker-compose.yml` – Compose file for running judge / support services in containers.
- `Dockerfile` – Image definition for the backend service.
- `index.js` – Main Express server (entry point).
- `node_modules/` – Installed dependencies.
- `package.json` / `package-lock.json` – Backend dependencies and scripts.
- `prisma/` – Prisma schema, migrations, and seed scripts.
- `routes/` – All Express route modules mounted under `/api/*`.

---

## `index.js` – Express App Setup

Key responsibilities:

- Loads environment via `dotenv.config()`.
- Creates Express app and configures middleware:
  - `cors()` – enables CORS for the frontend.
  - `express.json()` / `express.urlencoded()` – JSON and form parsing.
- Registers route modules:
  - `/api/auth` → `routes/auth.js`
  - `/api/judge` → `routes/judge.js`
  - `/api/ats` → `routes/ats.js`
  - `/api/dsa` → `routes/dsa.js`
  - `/api/progress` → `routes/progress.js`
  - `/api/learn` → `routes/learn.js`
  - `/api/roadmaps` → `routes/roadmaps.js`
  - `/api/cheatsheets` → `routes/cheatsheets.js`
- Health check:
  - `GET /api/health` – returns `{ status: 'ok', ... }`.
- Default root:
  - `GET /` – returns `{ message: 'Interview Platform API' }`.

This file does **not** contain business logic; it only wires middleware and routes.

---

## `routes/` – REST API Modules

Each route file defines an Express router and is mounted under a base path from `index.js`.

### `routes/auth.js`

- Handles **user authentication and registration**.
- Uses `bcryptjs` to hash passwords and `jsonwebtoken` to issue/access tokens.
- Typical endpoints (exact names may vary, see file):
  - `POST /api/auth/register` – create a new user.
  - `POST /api/auth/login` – authenticate and return JWT.
  - `GET /api/auth/me` – return current user profile based on JWT.

### `routes/judge.js` – Code Execution and Submission

- Provides endpoints for **DSA code execution** using containerized runners.
- Uses `@prisma/client` to fetch problem metadata and test cases and to record submissions.
- Uses Node `child_process.spawn` with Docker (or direct language runtimes) to execute user code in isolation.
- Key building blocks in the file:
  - BigInt‑safe JSON stringifier for handling large integers.
  - **Driver templates** for Python and JavaScript that wrap the user solution in a controlled main function.
  - `executeInDocker(language, code, testCases)` – orchestrates writing files, running containers, collecting stdout/stderr, and mapping results to per‑test‑case status.
  - Route handlers for:
    - `POST /api/judge/execute` – run code against **custom input** or a single test case.
    - `POST /api/judge/submit` – run code against **all official test cases** and record result in DB.
    - `GET /api/judge/languages` – list supported languages / runtimes.

> **Known limitation (Judge):**
> - On the frontend (DSA practice), run/test/submit currently **do not work reliably**. This is usually because Docker is not running, containers are not configured with the expected images, or there are mismatches between judge responses and frontend expectations. From the user perspective, DSA code execution is currently considered **broken**.

### `routes/ats.js` – ATS Resume Scoring API

- Wraps the `ATSScorer` class from `ai/ats.js`.
- Endpoints:
  - `POST /api/ats/analyze` – Full AI‑powered analysis. Expects `{ resumeText, jobDescription }`. Returns detailed breakdown and matching score.
  - `POST /api/ats/quick-score` – Lightweight keyword‑based matching; faster, no external AI.
  - `POST /api/ats/batch-analyze` – Score a resume against multiple job descriptions at once.
  - `GET /api/ats/keywords` – Returns ATS keyword categories.

These endpoints are consumed by the frontend ATS views (resume analysis pages).

### `routes/dsa.js` – DSA Content and Problem APIs

- Uses Prisma client to manage DSA topics, lessons, problems, and user progress.
- Main responsibilities:
  - `GET /api/dsa/sidebar` – Returns topics and lessons for sidebar navigation (ordered by topic/order).
  - `GET /api/dsa/lesson/:slug` – Returns a lesson by slug with previous/next metadata for navigation.
  - `GET /api/dsa/lessons/:id` – Fetch single lesson by ID.
  - `GET /api/dsa/topics/:slug/lessons` – All lessons for a topic.
  - `GET /api/dsa/problems` – Filterable problem list (by sheet, difficulty, pattern, search, user progress).
  - `GET /api/dsa/problems/:slug` – Single problem with progress for a specific user.
  - `GET /api/dsa/patterns` – Returns DSA patterns/metadata used for filtering.
- This data is rendered by the frontend DSA Learn and Practice pages.

### `routes/learn.js`

- APIs for the **Learn** section (Full‑Stack and AI/ML tracks).
- Likely endpoints:
  - `GET /api/learn/tracks` – List of available learning tracks.
  - `GET /api/learn/lessons` / `GET /api/learn/lessons/:id` – Lesson content.
  - `GET /api/learn/progress` – User progress per track/lesson.

Exact shapes depend on schema but the pattern mirrors DSA (topics, lessons, progress).

### `routes/progress.js`

- Centralized **progress tracking API** for DSA and Learn.
- Endpoints typically:
  - `POST /api/progress/update` – Mark a lesson/problem as started/finished/solved.
  - `GET /api/progress/:userId` – Fetch overall progress snapshot.

### `routes/roadmaps.js`

- Serves curated **roadmap** content (e.g. DSA Roadmap, Full‑Stack Roadmap, AI/ML Roadmap).
- Endpoints:
  - `GET /api/roadmaps` – List of roadmaps.
  - `GET /api/roadmaps/:slug` – Single roadmap with stages/items.

### `routes/cheatsheets.js`

- Serves **cheatsheet** content (DSA patterns, language snippets, system design notes, etc.).
- Endpoints:
  - `GET /api/cheatsheets` – List of cheatsheets by category.
  - `GET /api/cheatsheets/:category` or `/:slug` – Specific cheatsheet details.

---

## `ai/` – AI Utilities

### `ai/ats.js`

- Implements the `ATSScorer` class used by `routes/ats.js`.
- Responsibilities:
  - Parse raw resume/job description text.
  - Extract keywords and skills.
  - Compute scores for overall match, keyword coverage, and formatting.
  - Optionally call Grok or rules-based heuristics for deeper analysis.
- Exposes methods:
  - `analyzeResume(resumeText, jobDescription)` – Full AI analysis.
  - `quickScore(resumeText, jobDescription)` – Fast heuristic score.
  - `batchAnalyze(resumeText, jobsArray)` – Score against multiple jobs.
  - `keywordCategories` – Map of common ATS keywords.

---

## `prisma/` – Database Layer

- `prisma/schema.prisma` – Canonical database schema used by backend.
  - Contains models such as `User`, `DSATopic`, `DSALesson`, `Problem`, `Roadmap`, `Cheatsheet`, `InterviewSession`, `Resume`, `TestCase`, etc.
  - Fields store metadata like slugs, titles, content markdown, difficulty, patterns, progress records.
- `prisma/migrations/` – Auto‑generated migration history for evolving the schema.
- Seed scripts:
  - `prisma/seed.js` – Master seed orchestrator.
  - `prisma/seedFullStack.js` – Seeds full‑stack learning track.
  - `prisma/seedAIML.js` – Seeds AI/ML learning track.
  - `prisma/seedRoadmaps.js` – Seeds roadmap content.
  - `prisma/seedCheatsheets.js` – Seeds cheatsheets.
  - `prisma/seedPatterns.js` – Seeds DSA patterns/sheets.
  - `prisma/seedMaster250.js` – Seeds a curated list of ~250 DSA problems.
  - `prisma/seedSolution.js` – Seeds reference solutions/editorials.
  - `prisma/seedTestCases.js` – Seeds judge test cases for problems.

Scripts in `package.json`:

```bash
npm run prisma:generate   # generate Prisma client
npm run prisma:migrate    # run dev migrations
npm run prisma:seed       # run prisma/seed.js
npm run seed:problems     # seed DSA patterns + Master 250
```

---

## `data/` – Static JSON Data

- `data/courses.json` – Base course definitions for learning tracks.
- `data/enrichBatch1_part*.json` – Enrichment JSONs used by seed/AI scripts to enhance course or roadmap content.

These files are typically read by Prisma seed scripts to populate the DB.

---

## Docker and Deployment Files

- `Dockerfile` – Defines the backend service image (Node.js, dependencies, app code).
- `docker-compose.yml` – Orchestrates containers for:
  - Backend API
  - Judge runtime containers (Node/Python/Java/C++ images) if configured
  - Database (e.g. Postgres) if desired

> Note: Some judge scripts also spawn Docker containers directly via the CLI; ensure Docker daemon is running and required images are pulled.

---

## Known Issues and Non‑Working Parts (Backend)

As of **2026‑02‑23**, the following are known/backend‑side problems or caveats:

- **Judge / DSA code execution not wired correctly end‑to‑end:**
  - Even though `routes/judge.js` implements `executeInDocker` and submission logic, the frontend DSA pages report that **Run / Test / Submit do not work**.
  - Likely causes:
    - Docker not running or images not pulled.
    - Timeouts or errors inside containers not being surfaced clearly.
    - Mismatch between expected response shape and frontend consumption.

- **Legacy resume parsing logic vs. new architecture:**
  - Older versions used `pdf-parse` in Express routes to handle PDF uploads and parsing.
  - The current architecture favors **client‑side PDF parsing + server actions** in the frontend; some of the PDF‑related backend logic is now unused or partially deprecated.

- **AI / Grok configuration:**
  - If `GROK_API_KEY` is missing or invalid, AI-backed logic inside `ai/` helpers will fail.
  - Frontend currently reports resume parsing issues; these are mostly client‑side (pdf.js worker), but backend AI endpoints still require valid keys.

- **Auth vs. Clerk:**
  - The backend has its own JWT‑based auth in `routes/auth.js`, while the frontend primarily uses **Clerk**.
  - For some flows, you may be using Clerk tokens purely on the frontend and not verifying them on the backend;
    ensure that any sensitive backend routes either trust Clerk via middleware or are only used with backend‑managed JWT.

---

## How This Backend Relates to the Frontend

- Frontend (Next.js) calls this backend primarily under `/api/*` endpoints:
  - DSA content → `/api/dsa/*`
  - Code execution → `/api/judge/*`
  - ATS analysis → `/api/ats/*`
  - Learn content → `/api/learn/*`
  - Roadmaps → `/api/roadmaps/*`
  - Cheatsheets → `/api/cheatsheets/*`
  - Progress → `/api/progress/*`
- Database schema is shared; frontend also has a Prisma schema for type safety, but **this backend** is the main source of truth for seeding and migrations.

An AI that reads **this backend README** together with the **frontend README** will have a full high‑level picture of the PrepWise stack, routes, data models, and known limitations without needing direct code access.

