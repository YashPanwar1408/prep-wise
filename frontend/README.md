# PrepWise Frontend

**PrepWise** is the frontend for a full‑stack DSA + interview preparation platform. It is built with **Next.js App Router** and provides:

- Interactive DSA learning and practice
- AI‑powered interview rooms (human + AI)
- Resume builder / editor and ATS‑style analysis
- Curated roadmaps and cheatsheets

This README is meant to be a **single, self‑contained description of the entire frontend**, so another AI or developer can understand the project without access to the codebase.

> Date of snapshot: **2026‑02‑23**

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, React 19)
- **Styling:** Tailwind CSS 4, Aceternity UI, custom CSS (e.g. `stream-overrides.css`)
- **Auth:** Clerk (`@clerk/nextjs`)
- **State & Forms:** Zustand, React Hook Form, `@hookform/resolvers`, Zod
- **UI / Utility:** Radix UI primitives, `clsx`, `class-variance-authority`, `sonner` for toasts
- **AI:**
	- Grok API for resume parsing and interview helpers
	- `@vapi-ai/web` for AI voice assistant inside interview rooms
- **Video / Realtime:** `@stream-io/video-react-sdk`, `stream-chat-react`
- **Code & Markdown:** `@monaco-editor/react`, `react-syntax-highlighter`, `react-markdown`, `remark-gfm`, `rehype-highlight`
- **Data / DB:** Prisma Client (`@prisma/client`) against the backend database

The frontend talks to the **Express backend** (see backend README) via REST endpoints such as `/api/judge/*`, `/api/dsa/*`, `/api/ats/*`, `/api/learn/*`, etc.

---

## Running the Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

- Dev server default URL: `http://localhost:3000` (may use `3001` if 3000 is busy).
- Always run commands **from the `frontend` folder**, not from the monorepo root.

Build & production:

```bash
npm run build
npm start
```

---

## High‑Level Architecture

- `app/` – Next.js App Router tree: pages, layouts, route handlers
- `components/` – Reusable React UI components for navbar, interview UI, practice, resume, etc.
- `lib/` – Client and server utilities: API clients, AI helpers, PDF extractor, stream helpers, stores
- `actions/` – Server actions (e.g. Grok-based resume parsing)
- `hooks/` – Custom React hooks (mobile detection, Vapi integration)
- `prisma/` – Frontend Prisma schema (mirrors backend DB for direct usage where needed)
- `public/` – Static assets (logos, images, etc.)
- Root config – `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, Tailwind/PostCSS configs

The app is split by **feature domain** inside `app/`: DSA, Learn, Resume, Interview, Roadmaps, Cheatsheets, Dashboard, Auth, etc.

---

## Root Files and Folders

- `.clerk/` – Clerk configuration (auth settings, generated config)
- `.next/` – Next.js build output (should not be committed)
- `actions/` – Server actions, e.g. `resume.actions.ts` for Grok resume parsing
- `app/` – All routes, layouts, and API route handlers
- `components/` – Shared and feature‑specific components
- `hooks/` – Custom hooks for mobile UI and Vapi
- `lib/` – Utility layer: APIs, Prisma client, AI utilities, PDF extractor, store, etc.
- `prisma/` – Frontend Prisma schema (`schema.prisma`) used by Next.js side
- `public/` – Static public assets
- `middleware.ts` – Next.js middleware (typically used for auth/session handling with Clerk)
- `components.json` – Configuration for UI component generator (e.g. shadcn/ui or similar)
- `eslint.config.mjs` – ESLint configuration
- `next-env.d.ts` – TypeScript Next.js type declarations
- `next.config.ts` – Next.js config (images, experimental flags, etc.)
- `package.json` / `package-lock.json` – Dependencies and scripts
- `postcss.config.mjs` – PostCSS pipeline for Tailwind
- `tsconfig.json` / `tsconfig.tsbuildinfo` – TypeScript compiler configuration + build cache

---

## `app/` – Routes and Layouts

Top‑level:

- `app/layout.tsx` – Root layout: global `<html>`, `<body>`, fonts, global providers (Clerk, theme, toast), Navbar, etc.
- `app/page.tsx` – Landing/dashboard entry page (high‑level overview of PrepWise features).
- `app/globals.css` – Global Tailwind + custom CSS.
- `app/stream-overrides.css` – CSS overrides for Stream Video components.

### Auth Routes

- `app/(auth)/` – Group for auth‑related routes.
- `app/(auth)/login/` – Custom login page (likely wraps Clerk components).
- `app/(auth)/signup/` – Custom signup page.
- `app/sign-in/[[...sign-in]]/` – Clerk’s default sign‑in catch‑all route.
- `app/sign-up/[[...sign-up]]/` – Clerk’s default sign‑up catch‑all route.

### Dashboard

- `app/dashboard/page.tsx` – Authenticated user dashboard with quick links to DSA, Learn, Resume, Interview, etc.

### DSA (Data Structures & Algorithms)

- `app/dsa/page.tsx` – DSA home page: tabs for Learn vs Practice, sheets, filters.
- `app/dsa/learn/` – Lesson reading experience (fetches content from backend `/api/dsa/*`).
- `app/dsa/practice/` – Problem list and problem details for coding practice.
- `app/dsa/solve/` – Main coding environment (Monaco editor, language selector, run/submit buttons).
- `app/dsa/solution/` – Official editorial / community solutions view.

> **Known limitation (DSA):**
> - The **run / test / submit** buttons in the coding interface are currently **not working end‑to‑end**. They are meant to call the backend Judge service (`/api/judge/*`), but there are issues with Docker/runner configuration and/or request wiring, so test cases and submissions do not reliably execute.

### Learn (Full‑Stack & AI/ML)

- `app/learn/page.tsx` – Learn hub page.
- `app/learn/full-stack/` – Full‑stack learning track (curriculum, progress, lesson view using data from backend/Prisma).
- `app/learn/aiml/` – AI/ML learning track.

### Resume

- `app/resume/page.tsx` – Main resume feature landing page (tabs: upload, editor, ATS analysis etc.).
- `app/resume/home/` – Marketing/overview page for resume features.
- `app/resume/upload/` – **Resume upload + parsing page.**
	- Uses `lib/pdf-extractor.ts` to extract text from client‑side PDFs.
	- Sends extracted text to `actions/resume.actions.ts::parseResumeWithGrok` (server action) for AI-powered structuring into a `Resume` object.
	- On success, stores parsed resume in `sessionStorage` and forwards to editor.
- `app/resume/editor/` – Interactive resume editor (edit structured data, export PDF with `@react-pdf/renderer`).
- `app/resume/ats/` (if present) – ATS score / keyword matching UI using backend ATS routes.

> **Known limitation (Resume parsing):**
> - As of this snapshot, **PDF text extraction is failing in the browser**. The `pdfjs-dist` worker is still trying to load from a **Cloudflare CDN URL** (e.g. `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.worker.min.js`) and returns `404`, which causes `extractTextFromPdf` to throw.
> - This breaks resume parsing for both:
>   - `app/resume/upload`
>   - `app/interview/ai/setup` when a resume PDF is uploaded.
> - The code has been updated to use a different worker URL, but the running bundle is still fetching the old CDN worker; this needs to be fixed (e.g. by hosting the worker locally under `public/` and pointing `GlobalWorkerOptions.workerSrc` there).

### Interview

- `app/interview/page.tsx` – High‑level interview feature landing page.
- `app/interview/human/` – Placeholder/flow for human mock interviews (if implemented).
- `app/interview/ai/` – AI interview home.
- `app/interview/ai/setup/` – **AI interview setup page**.
	- Lets the user select interview type, difficulty, optional resume.
	- If a resume file is uploaded, reuses `lib/pdf-extractor.ts` + `parseResumeWithGrok` to parse CV before creating the interview session.
	- Calls backend/Next API routes to create an interview session and persist context.
- `app/interview/ai/lobby/[id]/` – Lobby screen for a specific AI interview session.
	- Shows video/mic preview using Stream Video SDK.
	- On **Join**, establishes/join a Stream call and then asks backend to start a Vapi AI assistant.
- `app/interview/ai/room/[id]/` – Main **AI Interview Room**.
	- Re‑initializes the Stream call.
	- Renders `MeetingRoom` component with video tiles, controls, and AI assistant integration.
	- On end, redirects to interview summary/report.

> **Known limitations (Interview):**
> - There have been issues where the AI interview room gets **stuck on "Joining meeting..."** if the Stream call is not properly joined before rendering `MeetingRoom`. Recent changes attempt to join in both lobby and room, but this flow may still be fragile and should be re‑tested.
> - Any Stream or Vapi environment variable misconfiguration will also prevent AI calls from starting correctly.

### Other Feature Routes

- `app/cheatsheets/` – Cheatsheets listing and detail pages (content seeded from backend Prisma).
- `app/roadmaps/` – Roadmap landing page and `[slug]/` routes for individual roadmaps.
- `app/community/page.tsx` – Community/room hub (may be partially implemented).
- `app/room/page.tsx` – Realtime room feature (could be used for peer mock interviews or study rooms).
- `app/shared/[token]/` – Shared links (e.g. shared resume, roadmap, etc. identified by token).
- `app/types/resume.ts` – TypeScript types for resume data shared across the app.

### API Route Handlers Under `app/api/`

These are Next.js route handlers used as a thin layer in front of the backend or direct services:

- `app/api/ai/*` – AI‑specific endpoints (e.g. generating questions, analyzing answers).
- `app/api/analyze-resume/` – Endpoint to run ATS analysis on a resume (likely forwards to backend `/api/ats/*`).
- `app/api/interview/*` – Endpoints for creating sessions, starting AI assistants, saving transcripts.
- `app/api/parse-resume/` – **(Removed)** Old route that previously accepted PDF uploads and handled parsing server‑side; now replaced by client‑side PDF extraction + server actions.
- `app/api/resume/*` – Resume persistence APIs (save, fetch latest, etc.).

> The current architecture favors **client-side PDF text extraction** and uses server actions for Grok calls instead of uploading raw PDFs to `/api/parse-resume`.

---

## `components/` – Shared UI Library

- `components/Navbar.tsx` – Top navigation bar (links to Dashboard, DSA, Learn, Roadmaps, Cheatsheets, Resume, Interview, profile menu, notifications).
- `components/MarkdownRenderer.tsx` – Wrapper around `react-markdown` + highlight/remark plugins to render lesson/problem markdown.

### Interview Components

- `components/interview/MeetingSetup.tsx` – Lobby UI: camera/mic toggles, preview, join button.
- `components/interview/MeetingRoom.tsx` – Main meeting UI: Stream call layout, call controls, AI assistant (Vapi) integration, end‑of‑call behavior.

### Learn Components

- `components/learn/AISidebar.tsx` – Sidebar for AI/ML learning track.
- `components/learn/FullStackSidebar.tsx` – Sidebar for Full‑Stack learning.
- `components/learn/LessonPage.tsx` – Generic lesson display page used by Learn and DSA modules.
- `components/learn/Sidebar.tsx` – Shared sidebar navigation.

### Practice / DSA Components

- `components/practice/CodeEditorPanel.tsx` – Monaco editor wrapper with language selection and boilerplate handling.
- `components/practice/OutputPanel.tsx` – Displays run/submit output, errors, and test case results.
- `components/practice/InterviewSessionUI.tsx` – UI for coding/behavioral sessions (if present).
  
> **Known limitation (Practice components):**
> - These components expect successful responses from backend Judge APIs; if Docker or judge routes are misconfigured, the UI will show errors or remain in a loading state when running/submitting code.

### Resume Components

- `components/resume/*` – All UI for resume builder/editor, sections, fields, and PDF export views.

### UI Components

- `components/ui/*` – Design‑system style components (buttons, inputs, dialogs, tabs, etc.), typically built on Radix UI primitives.

---

## `lib/` – Utilities and Services

- `lib/api.ts` – Frontend HTTP client helpers for talking to backend/Next API routes.
- `lib/db.ts` – Direct database helpers if the frontend accesses Prisma directly (for server components / actions).
- `lib/grok.ts` – Shared Grok helper functions (e.g. creating interview questions and generating feedback).
- `lib/pdf-extractor.ts` – **Client‑side PDF text extractor** built on `pdfjs-dist`.
	- Provides `validatePdfFile(file)`, `extractTextFromPdf(file)`, and `extractTextWithProgress(file, onProgress)`.
	- Configures `pdfjsLib.GlobalWorkerOptions.workerSrc` (currently the source of the worker 404 issue described above).
- `lib/prisma.ts` – Prisma client wrapper for frontend/server‑side usage.
- `lib/schemas/` – Zod schemas for resumes, interview objects, etc.
- `lib/services/` – Higher‑level services (e.g. ATS service, interview service) composed on top of `api.ts` and schemas.
- `lib/store/` – Zustand stores for client‑side state (e.g. interview session, resume drafts, DSA filters).
- `lib/stream.ts` – Stream Video helper functions (client initialization, token handling, etc.).
- `lib/utils.ts` – Generic utilities: class name helpers, formatting, etc.
- `lib/vapi.ts` – Vapi helper for AI voice interactions in interviews (hooked via `useVapi` and `MeetingRoom`).

---

## `actions/` – Server Actions

- `actions/resume.actions.ts` – Server actions specifically for resume features.
	- `parseResumeWithGrok(extractedText: string)` – Sends plain text to Grok with a strict JSON schema prompt and returns a typed `Resume` object.
	- `validateExtractedText(text: string)` – Basic length validation for extracted resume text.
	- Known issue: this action works only if `extractTextFromPdf` succeeds; currently blocked by the pdf.js worker error.

Other server actions may exist for interviews or DSA; they follow a similar pattern: thin, type-safe wrappers around Grok/Prisma/backend.

---

## `hooks/`

- `hooks/use-mobile.ts` – Detects mobile/viewport size and exposes booleans used to adapt layouts.
- `hooks/useVapi.ts` – Encapsulates Vapi AI client setup and exposes helpers/hooks to start/stop AI calls, track state, and integrate with `MeetingRoom`.

---

## `prisma/`

- `prisma/schema.prisma` – Prisma schema referencing the shared database (DSA topics, lessons, problems, roadmaps, cheatsheets, interviews, resumes, etc.). The actual schema is shared conceptually with the backend prisma schema so both sides operate on the same database.

Migrations and seeding are primarily maintained on the backend side; the frontend mainly uses generated Prisma client types.

---

## `public/`

- Contains static assets such as logos, icons, and images used throughout the app (e.g. PrepWise logo, dashboards icons, roadmap illustrations).

If you need to fix the pdf.js worker issue, a recommended approach is to copy `pdf.worker.min.js` here and reference it from `lib/pdf-extractor.ts` as `/pdf.worker.min.js`.

---

## Known Issues and Non‑Working Parts (Frontend)

This section summarizes current problems as of **2026‑02‑23**.

- **Resume PDF parsing broken:**
	- `lib/pdf-extractor.ts` configures `pdfjs-dist` worker, but the browser still tries to load from `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.worker.min.js`, which returns 404.
	- Symptoms: `Failed to extract text: Setting up fake worker failed: "Failed to fetch dynamically imported module: ...pdf.worker.min.js"` on `/resume/upload` and on AI interview setup when uploading a resume.

- **AI Interview room joining is fragile:**
	- If the Stream call is not properly joined in `app/interview/ai/lobby/[id]` or `app/interview/ai/room/[id]`, `components/interview/MeetingRoom.tsx` may stay stuck on **"Joining meeting..."**.
	- Recent changes attempt to join the call in both places, but this flow still needs thorough testing.

- **DSA code execution (run / test / submit) not reliable:**
	- The practice editor pages under `app/dsa/*` use `components/practice/*` and are expected to call backend Judge endpoints.
	- User‑reported: running code against test cases and submitting solutions is **not working**, most likely due to backend judge/Docker issues or missing wiring.

- **Stale diagnostics around removed `/api/parse-resume` route:**
	- The old `app/api/parse-resume/route.ts` file has been removed, but some tooling may still show stale TypeScript/LSP errors referencing it. These are not part of the running app.

---

## How to Use This README with an AI

If you cannot upload the full repo to an AI, you can instead provide **this README** to give:

- A full map of the frontend architecture
- The purpose of each folder and key file
- The relationship between frontend and backend services
- A list of **known broken or incomplete features**

For deeper work, you can also share the backend README (documenting APIs, Prisma models, and judge/ATS services). Together, these two documents describe the full PrepWise project at a high level.

