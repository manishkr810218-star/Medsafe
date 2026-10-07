# Medsafe — Drug Interaction Checker (prototype, Phase 3)

All drugs, foods and interactions are **fictional DEMO data**: not medical advice.

## Current project scope

This repository contains the starting prototype for the Medsafe problem statement. It has a React frontend, an Express API, a MySQL schema, medicine-name matching against the demo catalog, drug–drug and drug–food interaction checks, and English/Hindi text. The interaction tables represent relationships between the fictional catalog entries.

The required OCR pipeline and accuracy benchmark, standard drug codes, clinically sourced interaction knowledge graph, voice alerts, and doctor-facing alternative review are **not implemented yet**. Do not use the demo results for patient care.

- `frontend/`: React + Vite (port 5173)
- `backend/`: Node.js + Express + MySQL (port 4000)

## Setup
Requires Node 18.11+ and MySQL 8 (or MariaDB 10.5+). Run the database server before initializing the schema.

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

## Database commands (run in `backend/`)
| Command | What it does |
|---|---|
| `npm run db:init` | Create database if missing, apply schema, upsert demo seed |
| `npm run db:seed` | Re-apply demo seed only |
| `npm run db:reset` | **Drops the database**, then recreates and seeds it |

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
| GET | `/api/medicines/search?q=<name>` | Verify / search a name against the `drugs` table (read-only) |
| GET / POST | `/api/medicines` | List / add `{name, dose, frequency}` (name is verified server-side) |
| DELETE | `/api/medicines/:id`, `/api/medicines` | Remove one / clear all |
| POST | `/api/interactions/check` | `{medicineIds:[1,2], foodIds:["demo-citrus"]}` |

### Phase 3: how verification works
A name is **verified** only when it matches a row in the MySQL `drugs` table. Matching ignores case, leading/trailing
spaces, repeated spaces, hyphens and underscores (`" DEMO  xetine "` matches `Demoxetine`). The search endpoint never
writes to the database. `found` is `true` only for an exact normalized match; `matches` lists suggestions
(exact first, then names starting with, then containing the text). `genericName` is `null` until a generic-name
column exists in `drugs`. To verify more medicines, add rows to the `drugs` table (the seed only has 5 fictional ones).

```
GET /api/medicines/search?q=%20demoxetine%20
{ "success": true, "query": "demoxetine", "normalizedQuery": "demoxetine", "found": true,
  "medicine": { "id": "demoxetine", "name": "Demoxetine", "genericName": null, "isDemo": true },
  "matches": [ { "id": "demoxetine", "name": "Demoxetine", "genericName": null, "isDemo": true, "matchType": "exact" } ] }
```
Empty/missing `q` returns `400 { "error": "..." }`; database down returns `503 { "error": "..." }`.

No login yet: every request acts as the seeded "Demo Patient" (id 1). Tests: `cd backend && npm test`.
