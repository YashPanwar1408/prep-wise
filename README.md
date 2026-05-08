<div align="center">
  <img src="https://via.placeholder.com/800x200.png?text=PrepWise+-+The+Ultimate+Interview+Platform" alt="PrepWise Banner" />

  # 🚀 PrepWise — The End-to-End Technical Interview Platform
  
  **A massive, full-stack application architected to simulate top-tier FAANG interviews. PrepWise combines real-time AI Voice Interviews, Sandboxed Remote Code Execution, Groq-powered ATS Resume Analysis, and highly structured Engineering Roadmaps.**

  [![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
  [![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express)](https://expressjs.com)
  [![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech)
  [![Docker](https://img.shields.io/badge/Docker-Sandboxing-2496ED?style=for-the-badge&logo=docker)](https://docker.com)
  [![VAPI](https://img.shields.io/badge/VAPI-Voice_AI-6366F1?style=for-the-badge)](https://vapi.ai)
  [![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?style=for-the-badge)](https://groq.com)
  
  ---
  
  [**Frontend Docs**](./frontend/README.md) • [**Backend Docs**](./backend/README.md)
</div>

---

## 📖 Executive Summary

PrepWise is not just a coding platform; it is a complete simulation of the modern technical hiring process. Built to solve the fragmentation of interview preparation (jumping between LeetCode for DSA, ChatGPT for mock interviews, and random blogs for roadmaps), PrepWise unifies the entire lifecycle under one massive monorepo.

The platform is divided into a **React Server Components-driven Next.js Frontend** and a **Stateless Node.js/Express Backend** capable of executing untrusted user code in isolated Docker containers, processing massive NLP tasks via Groq LPUs, and orchestrating ultra-low latency WebRTC/WebSocket Voice AI streams.

---

## ✨ Comprehensive Feature Breakdown

### 1. 🤖 Real-Time AI Technical Interviews (`VAPI` + `GetStream` + `OpenAI`)
- **Dynamic Context Injection**: The AI doesn't just ask generic questions. Before the interview, your parsed resume and target job role are dynamically injected into the AI's system prompt. It asks questions specifically tailored to your past experience.
- **Ultra-Low Latency Voice**: Utilizing VAPI's Transient Assistants, audio is streamed directly to Deepgram (`nova-2`) for instantaneous Speech-To-Text, processed by OpenAI (`gpt-4o-mini`), and synthesized via OpenAI TTS (`nova`). This results in a human-like, sub-500ms latency conversational experience.
- **WebRTC Video Grids**: Integrated with Stream Video SDK to provide a visual, immersive meeting room environment, mirroring real remote interviews on Zoom or Google Meet.
- **Live Transcripts & Visuals**: The UI features real-time audio waveforms and live transcription parsing.

### 2. 💻 Sandboxed Remote Code Execution Engine (`Judge0` + `Docker`)
- **Isolated Execution**: Users can write DSA solutions in Python, Java, or C++. The Next.js frontend sends this code to the Express backend, which orchestrates execution via Judge0.
- **Containerized Security**: Every code submission spins up an ephemeral Docker container. The code is executed under strict Linux `cgroups` rules (e.g., maximum 5 seconds of CPU time, 128MB RAM limit, no network access) to prevent fork bombs and malicious host access.
- **Hidden Test Cases**: Code is run against dozens of hidden test cases stored in the PostgreSQL database, verifying Time Limit Exceeded (TLE) and exact `stdout` matching.

### 3. 📄 Intelligent Resume Builder & ATS Scorer (`Groq LLaMA-3`)
- **Privacy-First Parsing**: PDF resumes are parsed locally in the browser using a `pdf.js` Web Worker. Your raw PDF is never uploaded to our servers.
- **Lightning Fast AI Structuring**: The extracted text is sent to Groq's LPU architecture (using `llama-3.3-70b-versatile`). Groq processes thousands of tokens in under 1.5 seconds, outputting a strict Zod-validated JSON structure.
- **ATS Simulation**: The backend compares your JSON resume against target job descriptions. It uses deterministic Regex for baseline skill matching, and semantic LLM analysis to find implicit weaknesses, generating a 0-100 ATS score and paragraph-length feedback.
- **Real-Time Visual Builder**: A complex, multi-layered Zustand store manages the massive JSON state, allowing users to drag, drop, and edit their resume in a live preview environment without triggering React re-render hell.

### 4. 📚 The "Master 250" DSA Curriculum
- **Curated Content**: The backend database is seeded with 250+ highly curated FAANG-level questions.
- **Multi-Language Support**: Each problem comes with starter code and optimal solutions written in Python, Java, and C++.
- **Pattern Recognition**: Problems are grouped by algorithmic patterns (Sliding Window, Two Pointers, Dynamic Programming) mirroring the NeetCode/Grokking philosophy.

### 5. 🗺️ Engineering Roadmaps & Cheatsheets
- **Structured Learning**: Complete, phase-by-phase roadmaps for Full Stack Development, AI/ML Engineering, Frontend, and Backend.
- **Progress Tracking**: Users can mark modules as complete, seamlessly tracking their progress across hundreds of topics, persistently saved in the Neon database.
- **Static Generation**: Markdown-based cheatsheets are aggressively cached and served via Next.js React Server Components for instantaneous loads.

---

## 🏗️ Global System Architecture

PrepWise utilizes a highly decoupled, scalable monorepo architecture. 

```mermaid
graph TD
    %% Define User
    User(("🌐 Client Browser"))

    %% Frontend Block
    subgraph "Frontend Layer (Vercel Edge & Node Runtime)"
        Next["Next.js App Router"]
        ServerActions["Server Actions (Mutations)"]
        Monaco["Monaco Editor"]
        ResumeZustand["Zustand Store"]
        StreamSDK["Stream WebRTC SDK"]
    end

    %% AI Integrations
    subgraph "Voice AI Pipeline"
        VapiSDK["VAPI Web SDK"]
        Deepgram["Deepgram STT"]
        OpenAIMdl["OpenAI LLM & TTS"]
    end

    %% Backend Block
    subgraph "Backend API Gateway (Express / Node.js)"
        Express["Express API Router"]
        ExecController["Code Execution Logic"]
        ATSController["ATS & Groq Orchestration"]
        DataController["Course/DSA Content Logic"]
    end

    %% Infrastructure Block
    subgraph "Infrastructure & Persistence"
        NeonDB[("Neon Postgres Database")]
        PrismaORM["Prisma Client"]
        Judge0["Judge0 (Docker Execution Engine)"]
        GroqCloud["Groq Cloud Inference API"]
        ClerkAuth["Clerk Identity & Auth"]
    end

    %% Connections
    User <-->|HTTP/RSC| Next
    User <-->|WebSocket| VapiSDK
    User <-->|WebRTC| StreamSDK
    
    Next -->|Auth Webhooks & Checks| ClerkAuth
    Next -->|Server Actions| PrismaORM
    Next -->|REST POST| Express
    
    Express --> ExecController & ATSController & DataController
    
    ExecController -->|Containerized Code| Judge0
    ATSController -->|Inference Prompts| GroqCloud
    DataController -->|Queries| PrismaORM
    
    PrismaORM <-->|Connection Pool| NeonDB
    
    VapiSDK --> Deepgram --> OpenAIMdl
```

---

## 🗄️ Database Schema & Data Models

Our PostgreSQL database (managed via Prisma) is designed to handle complex relationships between users, learning modules, and dynamic content.

1. **User Management**: Driven by Clerk Webhooks, tracking `userId`, roles, and metadata.
2. **DSA Engine**:
   - `Problem`: Stores title, difficulty, markdown description, and optimal constraints.
   - `TestCase`: Hidden and public test cases (Input/Expected Output strings).
   - `Submission`: Records every execution attempt, memory usage, runtime, and language.
3. **Roadmaps**:
   - `Roadmap` -> `Phase` -> `Module`. A deeply nested relational tree.
   - `UserProgress`: Junction table linking a `User` to a completed `Module`.
4. **Resumes**: 
   - `Resume`: Stores the raw JSON AST of the parsed resume, tied directly to the user for instant retrieval upon login.

---

## 🔐 Security Model & Tenant Isolation

Building a platform that executes untrusted code and handles sensitive resume data requires strict security protocols:

1. **Code Sandboxing**: Node.js **NEVER** runs user code natively. All code is forwarded to Judge0, which mounts the payload in a `chroot` jail inside a locked-down Docker container.
2. **Database Isolation**: Every Prisma query explicitly includes `where: { userId: currentUserId }`. There is no superuser query that could accidentally leak another user's submissions or resumes.
3. **Route Protection**: The Next.js middleware enforces Clerk authentication on all routes except the public marketing pages. The Express API strictly validates incoming Next.js API tokens.
4. **Data Privacy**: PDFs are parsed using Web Workers *in the user's browser*. Only the extracted text string is sent to the AI for structuring. No actual PDF files are ever stored on an S3 bucket or database.

---

## 🚀 Getting Started & Local Deployment

This project is a massive monorepo. You must run both the Frontend and Backend servers concurrently.

### Prerequisites
- **Node.js**: v18.x or higher.
- **Database**: A PostgreSQL instance (Neon.tech recommended for connection pooling).
- **Docker**: Required ONLY if you are self-hosting Judge0. (You can also use the RapidAPI Judge0 endpoint).
- **API Keys**: You will need free tier keys for Clerk, GetStream, VAPI, and Groq.

### 1. Initialize the Database
Navigate to the `backend` directory. This is the source of truth for the database schema.
```bash
cd backend
npm install

# Create a .env file and add your DATABASE_URL
# DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true"

# Push the schema to your database
npx prisma db push

# Massive Seeding Operation (This will populate 250+ problems, tests, and roadmaps)
npm run seed:problems
npm run seed:roadmaps
npm run seed:cheatsheets
```

### 2. Start the Express Backend
```bash
# Still in the backend directory
npm run dev
# The backend will start on http://localhost:5000
```

### 3. Start the Next.js Frontend
Open a new terminal window.
```bash
cd frontend
npm install

# Create a .env file based on .env.example
# You MUST provide:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
# NEXT_PUBLIC_VAPI_API_KEY, VAPI_API_KEY
# NEXT_PUBLIC_STREAM_API_KEY, STREAM_SECRET
# NEXT_PUBLIC_API_URL="http://localhost:5000/api"

npm run dev
# The frontend will start on http://localhost:3000
```

---

## 🤝 Contribution Guidelines
This project involves complex asynchronous state and heavy system integrations. When contributing:
- Always utilize `Server Actions` for simple database mutations in the frontend. Do not build Express routes unless the task requires heavy compute, prolonged execution, or Judge0 interaction.
- Respect the `Zustand` store for the Resume builder. Do not lift state to standard React Context, as it will crash the browser due to infinite re-renders on keystrokes.

---
**Architected and built for peak engineering performance.**