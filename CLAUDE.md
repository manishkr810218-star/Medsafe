# Medsafe project context

Medsafe is a prototype for polypharmacy safety. The repository contains a React/Vite frontend (`frontend/`), an Express API (`backend/src/`), a MySQL schema plus fictional seed data (`backend/db/`), browser OCR review, optional RxNorm candidates, Hindi/Tamil demo alerts with voice, a typed demo graph, and a clinician summary. The root README documents setup and limitations.

## Run and verify

- Backend: `cd backend && npm ci && npm run db:init && npm run dev` (MySQL must already be running; copy `.env.example` to `.env` first).
- Frontend: `cd frontend && npm ci && npm run dev` (Vite proxies `/api` to port 4000).
- Backend tests: `cd backend && npm test`.
- Frontend build: `cd frontend && npm run build`.
- Use `npm ci` with the committed lockfiles. Keep local credentials in `backend/.env`, which is ignored by Git.

## Product requirements

1. Read printed and handwritten prescription images or PDFs with OCR. Show extracted text, confidence, and a correction step before adding medicines. Normalize medicine names to standard identifiers; never silently accept an uncertain match.
2. Model drug–drug and drug–food interaction edges with severity and provenance. Make unknown coverage explicit. The current MySQL tables and seed rows are fictional examples, not clinical evidence.
3. Explain alerts in plain language and speech in at least two Indian languages, with clear text fallback when speech is unavailable.
4. Provide a doctor-facing summary that cites each interaction and marks any safer alternative as a clinician-review suggestion rather than an automatic prescription.
5. Include an OCR benchmark on realistic prescription samples, report accuracy and limitations, and make the demo repeatable.

## Safety and development constraints

- Preserve visible DEMO labeling until interaction content is sourced and clinically reviewed. Never present fictional drug or food interactions as medical facts.
- Do not transmit prescription images or patient details to external services without explicit user consent and a documented data path.
- Keep patient and clinician workflows separate. Avoid implying that a missing interaction means a combination is safe.
- Maintain the existing frontend/backend API contract unless the change updates both sides together.
- Add meaningful tests for OCR normalization, interaction coverage, and API behavior as features are built. Run the backend tests and frontend build before committing.
