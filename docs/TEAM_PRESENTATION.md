# Medsafe: team and judges walkthrough

Medsafe is a **working technical prototype** for collecting several prescriptions and a clinic report, correcting OCR, comparing a medicine list against a small fictional interaction graph, arranging reminders, and preparing a report for clinician discussion. It is **not a clinical decision system**. The sample drug names and interaction rules are fictional. No medicine pair is declared safe because a rule is absent.

## The idea in one minute

1. A patient uploads more than one prescription and a clinic report on **Master report**. Browser OCR reads images or up to three pages per PDF. The patient checks the text against each original.
2. The patient confirms medicine names against the local sample catalog. The software compares selected medicine pairs and food pairs against typed graph edges, displays severity and provenance, and marks unmatched names as skipped.
3. The software shows two AI review connectors as **not connected**. It accepts two *simulated* reviewer notes to demonstrate the handoff, while the confirmation screen shows **0/2 authenticated doctor approvals**.
4. The patient acknowledges that the output is an unverified draft. The browser can print it or save it as PDF. Real patient release is blocked until actual independently authenticated clinician reviews and validated data are implemented.

The order matters: document correction comes before matching, matching before comparison, and human review before any care decision. The [WHO polypharmacy technical report](https://www.who.int/publications/i/item/WHO-UHC-SDS-2019.11) supports involving patients and a multi-professional team in medicine review; this app demonstrates that workflow rather than claiming clinical authority.

## What each technology does

| Component | Purpose in this build | Current boundary |
|---|---|---|
| React 18 + Vite 5 | Patient interface, charts, responsive pages, review flow | Browser prototype |
| Express + MySQL | Sample medicine list and typed interaction edges | Seeded fictional records, single demo patient, no login |
| PDF.js + Tesseract.js | Render PDF pages as images, then OCR text in a browser worker | English OCR; handwritten accuracy is unvalidated. [Tesseract API](https://github.com/naptha/tesseract.js/blob/master/docs/api.md), [PDF handling note](https://github.com/naptha/tesseract.js/blob/master/docs/faq.md) |
| RxNorm API | Optional lookup of a **corrected individual name** for candidate RxCUIs | A candidate code is not proof of identity or interaction safety. [NLM API documentation](https://www.lhncbc.nlm.nih.gov/RxNav/APIs/api-RxNorm.findRxcuiByString.html) |
| SVG + CSS | Severity chart, catalog match ring, network relationship map | Values come from the latest check or labelled fictional graph, never hidden sample figures |
| Web Audio + Notifications | In-tab reminder bell and optional system notice | Browser tab must remain open for the timer; notification support and permission vary. [MDN Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) |
| Web Speech API | Text-to-speech alerts and optional dictated note | Voices and recognition vary by browser; recognition may use a remote service, so the app asks for acknowledgement. [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) |
| Browser print | Print the draft or choose Save as PDF in the print dialog | No server-side signed PDF. [MDN `window.print()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) |

## Five-minute judge demonstration

1. Run the frontend and optionally the backend. If MySQL is absent, point out the **OFFLINE SAMPLE WORKSPACE** banner.
2. On **Overview**, explain the severity bars and catalog match ring. The chart provenance is printed below it.
3. Open **Master report**, choose **Load fictional sample case**, and show two sample prescriptions plus one checkup. Tick each *I checked this text* box, then add the recognized sample medicines.
4. Select Demo Citrus Fruit and Demo Leafy Greens, run the comparison, and show the potential links. Open **Compare** to show how pairs with no sample rule are labelled **No sample link** rather than safe. Open **Graph** to filter high-severity edges.
5. Enter two different fictional reviewer names and notes, mark them as simulated, and open **Confirmation**. Explain why the counters remain **0/2 AI** and **0/2 authenticated doctors**. Acknowledge and open the printable **UNVERIFIED DRAFT**.
6. Open **Reminders**, switch on a sample schedule entry, press **Test bell**, and explain the open-tab limitation. Alerts and draft summaries are available in English, Hindi and Tamil, with device-dependent voice output.

## Roadmap to a real patient-ready system

The prototype does not yet provide exact medical conclusions. A production path requires, in order:

1. A licensed, versioned interaction source covering Indian medicines, foods, contraindications and dose context; clinical review of every rule and any alternative recommendation.
2. Consent-based benchmark data for messy printed and handwritten prescriptions, including Indian brands and regional scripts; per-field accuracy, recall and human-correction measurements.
3. A secure identity and audit system for patients and clinicians. Two distinct qualified clinicians must sign the same report version; changed data must invalidate previous signatures. Reviewer names typed into the current UI are **not** signatures.
4. Two independently configured AI providers if multi-model review is desired. Their outputs must be treated as proposals with source citations, compared for disagreement, and sent to clinicians. No provider is connected now. Personal medical documents must not be sent to external providers without a consent and privacy design.
5. Encrypted server-side records, access control, retention policy, monitoring, and a signed report/PDF service. The current app keeps uploaded text only in memory and report counts in tab session storage.
6. Reliable reminders through a backend scheduler, push/SMS or a native app if alarms must work when the webpage is closed. The browser timer is a presentation feature.

## Running from VS Code on Windows

Open the repository in VS Code and use two PowerShell terminals. With a configured MySQL server, run the database setup and API in the first terminal:

```powershell
cd backend
npm.cmd ci
Copy-Item .env.example .env
# Edit .env for the local database credentials.
npm.cmd run db:init
npm.cmd run dev
```

Run the frontend in the second terminal:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open <http://localhost:5173/>. When the API is unavailable, the interface still works with explicitly fictional offline sample data. For checks, run `npm.cmd test` in `backend`, `npm.cmd run build` in `frontend`, and `npm.cmd run benchmark:ocr` for the synthetic OCR benchmark. The benchmark does not represent real handwriting.
