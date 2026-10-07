# Medsafe — Drug Interaction Checker (prototype)

All drugs, foods and interactions are **fictional DEMO data**: not medical advice.

## Current project scope

This repository contains a local React/Vite frontend, Express API, MySQL catalog, prescription OCR review flow, interaction graph, voice-enabled alerts and clinician summary. The interface supports English, Hindi and Tamil. The interaction tables represent relationships between fictional catalog entries.

This is a **technical demo, not a clinical checker**. It has no clinically sourced interaction graph or validated safer substitutions. Missing alerts do not mean a combination is safe. Do not use results for patient care.

## New patient workflow

The main application has **no separate Demo Lab page**. Open `/` for a patient dashboard, `/checker` for a full pair comparison, `/graph` for a severity-filtered network map, `/reminders` for a daily schedule, and `/report` to combine multiple prescriptions with clinic reports. Building a draft opens `/verification`, a simulated two-doctor handoff showing **0/2 authenticated approvals**. `/confirmation` gates the printable master **draft** behind an explicit acknowledgement that software does not make treatment decisions. Two AI connectors remain unconnected and reviewer records are simulations.

When the API/MySQL service is unavailable, the frontend switches to an **offline sample workspace** using the same fictional names and relationships as `backend/db/seed.sql`: **9 medicines, 6 foods, and 15 interaction edges**. The Master report page offers a starter case and an extended case with three prescriptions and two checkups. This mode is labelled in the banner and stores only sample medicines in the browser. Uploaded documents and their OCR text stay in the current tab's React memory. The dashboard keeps only non-identifying report counts in `sessionStorage` for that tab. See [the team explanation](docs/TEAM_PRESENTATION.md), [the full judges guide](docs/JUDGES_MASTER_GUIDE.md), and [the Gemini slide prompt](docs/GEMINI_PPT_PROMPT.md).

- `frontend/`: React + Vite (port 5173)
- `backend/`: Node.js + Express + MySQL (port 4000)

## Setup
Requires Node 18.11+ and MySQL 8 (or MariaDB 10.5+). Run the database server before initializing the schema.
For the portable MySQL installed in this local Codex workspace, run `powershell -ExecutionPolicy Bypass -File .\scripts\start-local-db.ps1` from the repository root after a restart. Other machines can use their own MySQL installation.

```bash
# 1) backend
cd backend
npm ci
cp .env.example .env        # PowerShell: Copy-Item .env.example .env
# Set DB_PASSWORD in backend/.env for your local database.
npm run db:init             # creates the database, tables and DEMO seed data
npm run dev                 # API on http://localhost:4000
# 2) frontend (new terminal)
cd frontend
npm ci
npm run dev                 # http://localhost:5173  (proxies /api to :4000)
```

In Windows PowerShell, use `npm.cmd ci` and `npm.cmd run dev` if `npm.ps1` is blocked by the script execution policy. The frontend runs independently in offline sample mode while the backend or MySQL is stopped.

## Database commands (run in `backend/`)
| Command | What it does |
|---|---|
| `npm run db:init` | Create database if missing, apply schema, upsert demo seed |
| `npm run db:seed` | Re-apply demo seed only |
| `npm run db:reset` | **Drops the database**, then recreates and seeds it |

## Prototype workflows

- **Prescription OCR:** Upload an image or PDF (up to 12 MB, 3 PDF pages) on `/prescription`. PDF.js renders PDF pages and Tesseract.js reads text in the browser. Correct the extracted text and explicitly confirm any identified **fictional demo catalog** name before adding it. Handwriting and brand names may be missed. The browser downloads the English OCR model on first use; the image is not uploaded to our API.
- **Standard code lookup:** After correction, enter an individual medicine name and opt in to send **only that name** to the US National Library of Medicine RxNorm service. The UI displays candidate RxCUIs for clinician confirmation. Codes are not automatically assigned, saved to the patient record, or used for interaction checks. This lookup has limited relevance for Indian brand names.
- **Interaction graph:** `/graph` and `GET /api/graph` show typed drug–drug and drug–food edges with severity and demo provenance. The graph is fictional and deliberately does not claim clinical coverage.
- **Patient alerts:** `/checker` uses English/Hindi demo messages and a Tamil demo summary. Each alert has a browser speech button (`en-IN`, `hi-IN`, `ta-IN`); speech depends on voices available on the device. Text stays visible.
- **Clinician view:** `/doctor` lists medicines, findings, severity, demo provenance and unverified names. It provides a printable review summary and states that no validated alternative is available. It does not suggest a specific replacement without evidence.
- **OCR benchmark:** `cd frontend && npm run benchmark:ocr` regenerates four synthetic English prescription-like images and measures normalized character error rate (CER, with spaces/punctuation removed) and fictional drug-name recall with the same Tesseract engine. The current synthetic set yielded **8/8 names recalled and 0 mean CER**; see `frontend/benchmark/results.json`. These are **not real handwritten prescriptions**; the result cannot predict performance on actual prescriptions.

## Remaining clinical work

Before any patient use, obtain licensed, clinically reviewed interaction data with source/version citations, drug identity validation suitable for local brands, real handwritten-prescription benchmark samples with consent, verified Hindi/Tamil clinical translations, clinician-approved alternatives, authentication, and privacy/security review.

Without Node, use the mysql CLI instead:
```bash
mysql -u root -p --default-character-set=utf8mb4 -e "CREATE DATABASE IF NOT EXISTS drug_interaction_checker CHARACTER SET utf8mb4"
mysql -u root -p --default-character-set=utf8mb4 drug_interaction_checker < backend/db/schema.sql
mysql -u root -p --default-character-set=utf8mb4 drug_interaction_checker < backend/db/seed.sql
```

## API
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | API + DB status |
| GET | `/api/drugs`, `/api/foods` | Demo catalogs |
| GET | `/api/graph` | Demo graph nodes, typed edges, severity and provenance |
| GET | `/api/normalize?name=<corrected-name>` | On-demand RxNorm code candidates; sends the supplied name to NLM |
| GET | `/api/medicines/search?q=<name>` | Verify / search a name against the `drugs` table (read-only) |
| GET / POST | `/api/medicines` | List / add `{name, dose, frequency}` (name is verified server-side) |
| DELETE | `/api/medicines/:id`, `/api/medicines` | Remove one / clear all |
| POST | `/api/interactions/check` | `{medicineIds:[1,2], foodIds:["demo-citrus"]}` |

### Phase 3: how verification works
A name is **verified** only when it matches a row in the MySQL `drugs` table. Matching ignores case, leading/trailing
spaces, repeated spaces, hyphens and underscores (`" DEMO  xetine "` matches `Demoxetine`). The search endpoint never
writes to the database. `found` is `true` only for an exact normalized match; `matches` lists suggestions
(exact first, then names starting with, then containing the text). `genericName` is `null` until a generic-name
column exists in `drugs`. To verify more medicines, add rows to the `drugs` table (the seed currently has 9 fictional ones).

```
GET /api/medicines/search?q=%20demoxetine%20
{ "success": true, "query": "demoxetine", "normalizedQuery": "demoxetine", "found": true,
  "medicine": { "id": "demoxetine", "name": "Demoxetine", "genericName": null, "isDemo": true },
  "matches": [ { "id": "demoxetine", "name": "Demoxetine", "genericName": null, "isDemo": true, "matchType": "exact" } ] }
```
Empty/missing `q` returns `400 { "error": "..." }`; database down returns `503 { "error": "..." }`.

No login yet: every request acts as the seeded "Demo Patient" (id 1). Tests: `cd backend && npm test`.
