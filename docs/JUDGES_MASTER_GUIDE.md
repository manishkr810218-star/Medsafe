# Medsafe — master guide for the team and judges

Use this guide with the `build-core-prototype` branch. It describes the software as built, not a proposed production system. All medicine names, foods, interaction links, doctor profiles and checkup values in the demonstration are **fictional**. Never describe a demo rule as medical evidence or a simulated reviewer note as doctor approval.

## 1. The confident opening

**One sentence:** Medsafe brings prescriptions, clinic notes, medicine lists and food choices into one review workflow so a patient can prepare a clear, multilingual discussion with a clinician.

**Thirty-second pitch:** “An older patient may collect prescriptions from several clinics and struggle to keep one accurate medicine list. Medsafe shows how to read documents with OCR, ask a person to correct the text, match names to a catalog, compare known drug–drug and drug–food graph links, and present possible risks in regional languages. It then prepares an explicitly unverified master report and a two-doctor handoff screen. Today the graph and doctors are fictional demonstration data. We make that boundary visible because a missing alert cannot prove safety.”

**Reason to use it:** The product idea is a shared review workspace. It makes scattered information easier to inspect, gives the patient understandable questions to take to the care team, and shows where verification is still missing. WHO identifies polypharmacy as a medication-safety priority and emphasizes patient involvement and multi-professional review: [WHO technical report](https://www.who.int/publications/i/item/WHO-UHC-SDS-2019.11).

**Who would use a validated future version:** patients and caregivers who manage several medicines, prescribing clinicians, pharmacists, and clinic teams. **Who may use this version:** a team or judge demonstrating a technical workflow with fictional data. It is not suitable for patient treatment decisions.

## 2. What is in the current build

- **Overview:** patient workspace with counts, severity bars, catalog match ring, recent draft summaries and today's reminder schedule. The chart states whether it uses the latest comparison or the fictional catalog graph.
- **My Medicines:** add, search, match and remove names. In API mode an exact name match is checked by the backend against MySQL. An unrecognized name stays unverified and is skipped in interaction checks. A catalog match means identity within this demo database, not clinical validation.
- **Compare:** select saved medicines and foods. The system reports only graph links present in the selected catalog and labels unlisted pairs “No sample link,” never “safe.”
- **Scan:** upload an image or PDF, run OCR, correct the text, review candidate names, and optionally request RxNorm code candidates for one corrected name.
- **Reminders:** edit a daily schedule, test a bell, mark a dose taken and optionally enable browser notifications. The timer works only while the tab is open.
- **Master report:** collect multiple prescriptions and clinic reports, correct and confirm text, add names to the medicine list, choose foods, compare, attach fictional reviewer notes, then build a draft.
- **Dr. verification in process:** a *simulated* handoff with two fictional doctor profiles. The actual authenticated approval count remains **0/2**, and patient-ready release remains blocked.
- **Confirmation and printable draft:** a release checkpoint explains the software's limits, asks the viewer to acknowledge them, then shows an **UNVERIFIED DRAFT**. “Print / Save as PDF” uses the browser print dialog.
- **Clinician:** a summary of the medicine list and findings for review, without an unsupported substitute recommendation.
- **Graph:** a severity-filtered SVG network with typed drug–drug and drug–food edges and provenance labels.

The current catalog contains **9 fictional medicines, 6 fictional foods, and 15 fictional interaction edges**: 8 drug–drug and 7 drug–food. There are high, moderate and low severity examples. These are **software demonstration counts**, not medical statistics or coverage estimates.

The Master report offers two built-in cases:

1. **Starter:** two fictional prescriptions and one fictional checkup.
2. **Extended:** three fictional prescriptions, two fictional checkups, six named fictional medicines and a sample food history. Its synthetic vital and laboratory values are shown as document context; the app does **not** interpret them or infer diagnoses.

## 3. How it works, in plain language

1. **Read:** PDF.js renders a PDF page as an image; Tesseract.js reads text from the image or an uploaded photo. OCR runs in the browser with an English model. Tesseract.js does not directly read PDF pages; rendering first is the documented pattern: [Tesseract.js FAQ](https://github.com/naptha/tesseract.js/blob/master/docs/faq.md).
2. **Correct:** the patient checks extracted text against the original. OCR confidence is displayed, but confidence does not replace human review. The current upload limit is **12 MB** and **3 PDF pages** per file.
3. **Match:** the app looks for fictional catalog names in corrected prescription lines. The backend can search its MySQL drug catalog. The optional RxNorm endpoint returns **candidate** RxCUIs for a corrected individual name; it does not certify the medicine or an interaction. NLM explains that even an exact name search can return more than one concept: [RxNorm API](https://www.lhncbc.nlm.nih.gov/RxNav/APIs/api-RxNorm.findRxcuiByString.html).
4. **Compare:** selected medicine IDs and food IDs are checked against typed graph edges. Severity, message and data provenance are shown. An unknown or unmatched name is skipped and visibly reported.
5. **Explain:** the UI supports English, Hindi and Tamil labels and summary speech where the browser has a suitable voice. Optional dictated context uses browser speech recognition and requires an acknowledgement because some browsers send audio to a recognition service: [MDN SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).
6. **Review:** the current doctor screen illustrates a future handoff. It records fictional notes, shows **0/2 authenticated approvals**, and cannot issue a patient-ready report. Two AI connectors are shown as **not connected**.
7. **Share for discussion:** the viewer may print the unverified draft or save it as a PDF through the browser. The PDF is not digitally signed.

## 4. Technology map — what each part is for

- **React 18:** components and state for dashboard, forms, comparison, localization, reminders and report flow.
- **Vite 5:** local development server and production frontend build.
- **React Router 6:** routes such as `/report`, `/verification`, `/confirmation` and `/graph`.
- **Node.js + Express 4:** JSON API for catalogs, medicine search, patient medicine records, graph data, comparison and optional RxNorm lookup.
- **MySQL + mysql2:** stores one seeded demo patient, fictional medicine and food catalogs, typed interactions and saved demo-patient medicine entries. It is not a production health-record system.
- **PDF.js (`pdfjs-dist`) + Tesseract.js:** browser-side PDF rendering and English OCR. The OCR text is editable before matching.
- **SVG and CSS:** responsive severity chart, catalog ring and network map. No external graph database or chart service is in use.
- **Web Audio + Notifications:** local reminder bell and optional system notice. Notifications depend on browser permission; a closed tab stops this prototype's timer: [MDN Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API).
- **Web Speech API:** text-to-speech alerts and optional speech-to-text clinic note. Browser and device support vary.
- **Browser print:** printable draft and Save as PDF. No server-side PDF signing: [MDN `window.print()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print).

**Data locations:** In API mode, the current demo patient's medicine list is in MySQL. Reminders and the last comparison are in browser `localStorage`. In offline sample mode, the fictional medicine list is also in `localStorage`. Uploaded document files and extracted report text stay in current React memory and disappear on reload or tab closure. Only non-identifying draft counts are kept in that tab's `sessionStorage`. There is no user account, encrypted record service, sharing workflow or audit trail yet.

**No AI model decides care:** the interaction comparison is deterministic lookup against fictional graph rows. There is no LLM interaction inference, multi-agent consensus, live search-engine verification or authenticated physician review in the current build.

## 5. Running the software in VS Code on Windows

Open the repository and use **two VS Code terminals**. Node.js 18.11+ is needed. A local MySQL server is optional for the demonstration because the frontend has a clearly labelled offline sample workspace.

**Terminal 1 — API and MySQL mode:**

```powershell
cd backend
npm.cmd ci
Copy-Item .env.example .env
# Set the local MySQL connection values in backend/.env.
npm.cmd run db:init
npm.cmd run dev
```

If the database already exists and you only need the expanded fictional catalog, run `npm.cmd run db:seed` in `backend`. It upserts demo rows. Avoid `db:reset` unless you intend to delete the demo database.

**Terminal 2 — interface:**

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173/`. `npm.cmd` bypasses the Windows PowerShell `npm.ps1` execution-policy issue without changing system policy. If the API is unavailable, the banner says **OFFLINE SAMPLE WORKSPACE**; the fictional workflow still runs.

**Checks:** `npm.cmd test` in `frontend` and `backend`, `npm.cmd run build` in `frontend`, and `npm.cmd run benchmark:ocr` in `frontend`. The current automated suite has 3 frontend tests and 23 backend tests. The OCR benchmark has 4 synthetic English images, **8/8 fictional names recalled** and **0 mean normalized character error rate** in the checked-in results. This is a narrow synthetic result, not a handwritten-prescription accuracy claim.

## 6. Five-minute live demonstration for judges

**Prepare before presenting:** use a fresh demo tab, check that the URL loads, choose English or Hindi, and ensure the `Graph` page shows **9 / 6 / 15**. Decide whether you will use MySQL mode or offline mode. If the medicine list already contains entries from practice, say that current results depend on that list; do not promise a fixed finding count.

1. **0:00–0:35, problem:** Show **Overview**, then briefly show **Graph** with **9 / 6 / 15** and its High filter. Say the one-sentence pitch and point to the fictional provenance label.
2. **0:35–1:25, documents:** Open **Master report → Load extended fictional case**. Show **three prescriptions and two checkups**. Explain the checkup values are synthetic context and are not interpreted. Tick the five text-review boxes after showing the correction fields.
3. **1:25–2:05, reconcile:** In the candidate chips add any names not already on the medicine list. Choose **Demo Herbal Tea** and **Demo Berry Bowl** as sample foods. Explain that uncertain names are not silently accepted.
4. **2:05–2:50, compare:** Press **Run comparison**. With a fresh six-medicine list, these selections create **7 fictional links**; an existing list may create more. Show severity labels and provenance. The graph is catalog-wide; the report findings are patient-selection-specific. **Stay on Master report until the draft is built** because this version does not preserve the unfinished form when you leave its route.
5. **2:50–3:40, review:** Press **Fill fictional doctor examples** and **Build draft & view doctor review**. Show **Dr. verification in process**, point to **0/2 authenticated approvals**, and say “This is a visual handoff simulation. No doctor has received the report.”
6. **3:40–4:20, report:** Open **Confirmation**, note **0/2 AI** and **0/2 doctors**, acknowledge, and show **UNVERIFIED DRAFT**. Mention browser print-to-PDF. Do not call it a signed medical report.
7. **4:20–5:00, access and next step:** Switch to Hindi or Tamil, demonstrate a text-to-speech button if the browser supports it, then show **Reminders → Test bell**. Finish with the roadmap: validated data, real handwriting evaluation, identity and consent, and two authenticated clinicians.

**If time is short:** demonstrate Overview → Graph → Master report extended case → doctor handoff → Confirmation. Explain OCR on the Scan page without waiting for a model download.

**If the live demo fails:** use the offline sample banner as an honest fallback, reload the page, or show screenshots captured beforehand. Do not claim the backend is running when it is not. If the report draft disappears after a reload, explain that this prototype intentionally holds report text only in tab memory and recreate the fictional case.

## 7. What to say about innovation and value

“Our value is the **workflow and its safety gates**: multiple source documents, visible correction, explicit match coverage, typed interaction links, regional-language explanations, and a report that refuses to appear verified merely because software produced it. The prototype demonstrates how a patient and care team could see the same evidence, uncertainties and pending approvals.”

Avoid saying “accurate medical AI,” “100% OCR,” “clinically verified graph,” “two doctors approved,” “works with all Indian medicines,” or “no alert means safe.” None of these is true today.

## 8. Difficult judge questions and confident answers

### Problem, users and evidence

**Q1. What exact problem are you solving?**  
A. Scattered prescriptions and unclear medicine lists make review hard for patients and clinicians. The prototype demonstrates one place to collect, correct, compare and discuss that information.

**Q2. Why focus on polypharmacy?**  
A. More medicines and prescribers create more information to reconcile. WHO lists medication safety in polypharmacy as a priority and emphasizes patient participation and multi-professional review. We cite that as the motivation, not as validation of our software.

**Q3. Who is the primary user?**  
A. The patient or caregiver starts the workflow; a clinician or pharmacist must interpret real findings. The current software is for technical demonstration only.

**Q4. What is your main feature?**  
A. The master-report flow: several prescriptions plus checkups, corrected OCR, medicine and food comparison, evidence display, and a clearly blocked doctor-verification handoff.

**Q5. What does your graph contain?**  
A. Nine fictional medicine nodes, six fictional food nodes and fifteen fictional links. Edges have type, severity and provenance. It demonstrates the data shape and UI, not clinical coverage.

### OCR, normalization and data

**Q6. Can it read handwriting accurately?**  
A. We have not established that. The OCR is English Tesseract in the browser. Our measured benchmark uses four synthetic images, not real handwriting; every extracted line must be checked by a person.

**Q7. Why is the benchmark 8/8 but you still say OCR is unvalidated?**  
A. The 8/8 result is name recall on a small, generated English set. It cannot estimate performance on real messy handwriting, Indian brands, low-light photos or regional scripts. We state the dataset and metric beside the number.

**Q8. What happens if a name is misspelled or unreadable?**  
A. The editable OCR field lets a user correct it. If it still does not match the catalog, the name remains unverified and is excluded from interaction checks. We display that exclusion.

**Q9. Does RxNorm solve Indian brand normalization?**  
A. No. The opt-in lookup only returns candidate RxCUIs for one corrected name. It is not automatically accepted, may not cover local brands, and is not used as an interaction source.

**Q10. Does the software analyze laboratory values or diagnoses?**  
A. No. The fictional checkup values are displayed in the report as source context. There is no lab interpretation, disease inference or dose adjustment logic.

**Q11. Why call it a knowledge graph if it is stored in MySQL?**  
A. “Knowledge graph” describes the node-edge data model. The current prototype stores typed edges in relational tables and renders a network view. A dedicated graph database is not required for this small catalog.

**Q12. What does a high-severity alert mean here?**  
A. Only that a fictional sample edge is labelled high to test ordering and visuals. It is not a clinical severity assessment.

**Q13. What if a pair is absent from the graph?**  
A. We show “No sample link.” Absence could mean missing data, so we never call the pair safe.

**Q14. How do you avoid duplicate medicine entries?**  
A. The sample workspace prevents case-insensitive duplicate names; the backend stores one name per demo patient and verifies catalog matching before saving. We still need production-grade ingredient and dose reconciliation.

**Q15. How are food interactions selected?**  
A. The user explicitly checks foods for the comparison. The app does not infer actual diet from a document or silently select foods from a sample checkup.

**Q16. Are the 15 graph links all checked for every patient?**  
A. No. The graph page shows the whole fictional catalog. A patient comparison checks only selected medicines and foods. That is why report finding counts depend on the current list.

### AI, clinicians and safety

**Q17. Is AI making a final treatment decision?**  
A. No. There is no connected AI review service; the current comparison is deterministic fictional data lookup. Treatment decisions require qualified clinicians and validated evidence.

**Q18. Where are the two AI agents?**  
A. The UI marks both connectors as “not connected.” Real multi-model review is a planned integration, not a current capability.

**Q19. Have two doctors actually verified a report?**  
A. No. The doctor profiles and notes are fictional. The screen explicitly displays **0/2 authenticated approvals**, and patient-ready release is blocked.

**Q20. Why show “Dr. verification in process” if nobody is reviewing?**  
A. It is a visual demonstration of the proposed handoff. The same screen immediately states “Simulated workflow,” “No doctor has received the report,” and the actual approval count. We would only advance a real status through authenticated, auditable clinician actions.

**Q21. What if two future doctors disagree?**  
A. A production design would hold the report, show both comments and disagreement, and require a documented resolution. The prototype has no real approval or arbitration engine.

**Q22. Can you suggest a safer alternative medicine?**  
A. Not safely with this fictional graph. The clinician page asks for review but does not name a replacement. Validated alternatives require diagnosis, dose, allergies, kidney/liver context and reviewed evidence.

**Q23. Why is the PDF labelled unverified?**  
A. Printing a report does not authenticate its content. The watermark and approval counters keep its status explicit. It is a discussion draft, not a prescription or signed clinical report.

**Q24. What if a medicine changes after review?**  
A. The app clears the last comparison when the medicine list changes. A future signed workflow must version the entire report and invalidate previous approvals whenever source data changes.

### Privacy, deployment and reliability

**Q25. Are uploaded prescriptions sent to your server?**  
A. The OCR path reads the uploaded image or PDF in the browser. The optional RxNorm lookup sends a corrected medicine name only after opt-in. Optional browser speech recognition may send audio to its provider, so the UI asks for acknowledgement.

**Q26. Where is patient information stored?**  
A. The API uses one seeded demo patient in MySQL for medicine entries. Uploads and full draft text stay only in React memory. Reminders and a last comparison can persist in browser local storage, while recent report counts use session storage. These choices are for a local demo, not production health-data handling.

**Q27. Does it work offline?**  
A. The frontend can compare against the fictional offline sample catalog if the API or database is unavailable. OCR may need its language model downloaded on first use, and voice recognition may depend on a remote browser service.

**Q28. Do reminders work after closing the browser?**  
A. No. They run with an open tab. A production reminder would need a background service, push, SMS or native-app scheduling with explicit consent and reliability testing.

**Q29. Does it run on a phone?**  
A. The pages use responsive CSS. Browser OCR speed, audio and notification support vary by device; we have not certified devices or accessibility for clinical use.

**Q30. How would you deploy it safely?**  
A. First add authenticated patient and clinician identities, encrypted storage and transport, consent, audited access, versioned clinical rules, validated translations, real-world OCR testing and a signed-report service. The current branch is a local prototype.

**Q31. How would you measure success?**  
A. For the next phase: per-field OCR accuracy and name recall on consented real prescriptions; correction time; catalog match precision and unknown-name rate; sensitivity and specificity against an independently reviewed interaction reference; comprehension of regional-language alerts; reviewer turnaround and disagreement rate. We do not have these measurements today.

**Q32. What if the API, MySQL or network fails during judging?**  
A. The interface falls back to a labelled offline sample workspace. It can demonstrate the fictional workflow without pretending that live clinical data was checked.

**Q33. Why did you use MySQL instead of a graph database?**  
A. The demo catalog is small and relationships have a simple schema; MySQL gives reproducible seed data and straightforward joins. A larger evidence graph may justify another storage design after real data and query needs are known.

**Q34. How expensive is it to run?**  
A. This local demo uses ordinary browser and Node tooling; no connected paid AI or doctor network is part of the build. Production cost cannot be estimated honestly until data licenses, security, hosting, review staffing and usage are specified.

**Q35. What is your strongest limitation?**  
A. The clinical data is fictional. The work demonstrates software workflow and safety boundaries; it cannot produce real interaction conclusions without validated sources and clinician review.

**Q36. Is Tamil coverage complete?**  
A. The interface, selected demo summaries and speech language selection include Tamil, but the MySQL seed stores English and Hindi food names and rule text. Some API-backed details fall back to English. Clinical translation quality has not been evaluated.

## 9. Exception flows to demonstrate or explain

- **File above 12 MB or PDF above 3 pages:** OCR rejects it with a limit message; split or reduce the fictional test file.
- **Illegible or empty OCR:** correct the text manually against the original. Do not confirm unreadable content as accurate.
- **Unknown medicine:** preserve it as unverified; show that it is skipped rather than silently assigning a different identity.
- **No graph edge:** show “No sample link”; never interpret it as a safe pair.
- **No selected food:** drug–drug links can still be shown; drug–food links require an explicit food selection.
- **Missing prescription, clinic report, text review or comparison:** the master draft button remains disabled.
- **Same reviewer name in both demo slots:** the draft gate requires two distinct names. This remains a simulation, not identity verification.
- **Microphone unsupported or declined:** type the optional context note. Speech recognition is not needed for the report.
- **Notification denied or tab closed:** use the visible schedule and test bell while the tab is open; do not promise an alarm after closure.
- **API/MySQL unavailable:** the banner identifies the offline fictional workspace; the app can still demonstrate the local sample graph.
- **Navigate away before building a draft:** the unfinished Master report form resets; complete its workflow before visiting another page. The medicine list itself remains saved separately.
- **Reload after creating a draft:** document text and the full draft disappear because this version keeps them in memory. Recreate the fictional case for the demo.
- **Real doctor or AI approval requested:** show **0/2** and “not connected”; explain the future authentication, consent and audit design.

## 10. Questions you can ask judges or mentors

- Which user should be prioritized for a real pilot: patient, caregiver, pharmacist or hospital discharge team?
- What licensed Indian medicine and interaction data can we validate and cite?
- What consented prescription set could test handwriting, local brands and regional scripts?
- Which clinicians would review the rules and sign a report, and how should disagreement be resolved?
- What privacy, retention and deployment requirements would a hospital expect before a pilot?

## 11. Final sentence for the presentation

“Medsafe already demonstrates the complete information flow; the next milestone is not a prettier warning. It is trustworthy evidence, measured OCR on real prescriptions, and authenticated human review before any patient-ready conclusion.”

