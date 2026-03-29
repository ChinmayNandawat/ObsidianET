# ObsidianET

A polished, profile-driven personal finance recommendation and simulation workspace powered by AI.

This repository contains the Obsidian ET prototype — a Next.js (App Router) application that combines client-side user profiling, personalized recommendation flows, and AI-driven synthesis (Gemini / Groq) to build a tailored financial guidance experience.

---

Highlights
- Profile-first UX: users complete a compact profiling flow stored in localStorage under `obsidian_profile` and used across pages (Hub, Simulation, Chat).
- Personalized Hub & Simulation: recommendations and projections generated from profile data.
- Extensible AI backends: code integrates multiple AI providers (Google Generative AI / Gemini and Groq/Llama) via API routes.
- Supabase OAuth scaffolding (Google) for authentication flows.

Table of contents
- What it is
- Quickstart (dev)
- Environment variables
- Key concepts & architecture
- Common tasks
- Troubleshooting & known issues
- Contributing
- License

## What it is

ObsidianET is an experimental front-to-back demo showing how a profile-driven product can combine server-side AI generation and client-side personalization. It's designed as a working prototype you can run locally, explore, and extend.

The app includes:
- A Terminal-style chat (chatbot) for step-by-step profile building and conversation.
- An Active Hub that surfaces recommendations, discovery cards and next-best-actions.
- A Future Outcome Simulation page that visualizes projection scenarios derived from the user's profile.

## Quickstart (local development)

Prerequisites
- Node.js 18+ (LTS recommended)
- npm (or yarn)
- An optional Google Cloud project / API key for Gemini or a GROQ API key depending on which backend you prefer to test.

Install dependencies

```bash
cd /path/to/ObsidianET
npm install
```

Run the dev server

```bash
npm run dev
# or, if you prefer explicit path execution:
npm --prefix $(pwd) run dev
```

Open http://localhost:3000 in your browser.

Notes
- If `EADDRINUSE` occurs, another process is listening on port 3000 — find and kill it with `lsof -iTCP:3000 -sTCP:LISTEN -n -P` then `kill <PID>`.

## Environment variables

The project reads environment files in this order (Next.js behavior): `.env.local`, `.env.development`, `.env`.

Common variables used by the project (examples only — do not commit secrets):

- GROQ_API_KEY=your_groq_api_key_here
- GOOGLE_API_KEY=your_google_generative_ai_key_here (if using Gemini)
- NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
- SUPABASE_SERVICE_ROLE_KEY=(server-only — set on server env, do not commit)

Place the keys in `.env.development` for local development.

Important: The repo may call AI services on server-side API routes during dev. If you don't supply credentials or you hit quotas, requests to the AI endpoints will return 429 (quota) or 401 (unauthorized). See Troubleshooting below.

## Key concepts & architecture

- Next.js (App Router) application. Routes under `app/api/*` are App Router API routes (server functions).
- Client-side profile storage: `lib/profileStore.ts` keeps a typed `ProfileData` object in `localStorage` under the key `obsidian_profile`.
- Cross-page sync: the app uses load-on-mount to read profile and conditionally render overlays when profiling is incomplete.
- AI backends: API routes use either the Groq SDK (GROQ_API_KEY) or Google Generative AI (Gemini) depending on route implementation.
- Auth scaffolding: Supabase client/server helpers and an `AuthProvider` exist to enable Google OAuth flows — you'll need to wire your Supabase project and env vars to test auth locally.

Important files & folders
- `app/` — Next.js pages and API routes
- `components/` — React components grouped by feature
- `lib/` — helper code: `api.ts`, `profileStore.ts`, server helpers
- `types/` — TypeScript shared types

Local storage
- The canonical profile key is `obsidian_profile`. If you need to pre-populate for testing, set that key in the browser devtools with a JSON object matching `ProfileData` shape.

## Common tasks

- Preview collaborator branch without affecting your working tree: the project supports `git worktree` (we commonly create a review worktree to inspect branches safely).
- Add a new AI provider: implement an API route in `app/api/` that wraps the provider SDK and uses env vars for keys.
- Mock AI responses in dev: to avoid consuming quota, stub the API route(s) in `app/api/` to return canned responses when `NODE_ENV=development` or when a specific env var (e.g., `MOCK_AI=true`) is present.

## Troubleshooting & known issues

- Gemini / Google Generative AI quotas: you may see `429 Too Many Requests` during development if the project calls the model too often or you are on a free tier. Options:
  - Use a mock for `app/api/gemini` during development.
  - Increase project quota / enable billing on your Google Cloud project.

- Git merge/pull blocked by local changes: if `git pull` fails because of uncommitted changes, either stash them (`git stash`), commit them, or create a worktree to inspect other branches (`git worktree add ../ObsidianET-collab-review origin/collaborator-test-profile-integration`).

- React hook errors: if you see `Rendered more hooks than during the previous render` — ensure hooks are called unconditionally at the top of a component.

## Contribution guidelines

This repository is experimental but welcomes improvements. When contributing:

- Open a branch with a descriptive name, e.g. `feat/add-mock-ai` or `fix/hub-filter-bug`.
- Keep changes scoped and include tests or manual steps where relevant.
- If you change env var names, update this README.

## Security & secrets

- Never commit secret keys. Use `.env.local` (gitignored) to store sensitive values.
- Server-side only keys (service role keys) should never be present in client-exposed vars.

## License

This repository does not include a license by default. Add a `LICENSE` file if you intend to publish or share under a specific license.

## Contact / credits

Maintainer: Obsidian ET team

---

If you'd like, I can (choose one):
- open a PR from `chore/add-readme` -> `main`, or
- push this branch to origin (already planned in the next step), or
- also add a mocked AI dev-mode server to avoid Gemini/Groq quota during development.

Thank you — happy to iterate on language, add screenshots, examples, or a short demo GIF.
# ObsidianET
