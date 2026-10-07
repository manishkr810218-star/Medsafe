# Copyable Gemini prompt — Medsafe judge presentation

Copy everything below the line into Gemini. If possible, attach screenshots of the Medsafe Overview, extended Master report, Graph, Dr. verification and Confirmation screens. The prompt is self-contained even without screenshots.

---

Create a **fully visualized, editable PowerPoint presentation (PPTX)** for a five-minute hackathon judge presentation. Use **exactly 10 slides**; this is the minimum clear structure for the problem, workflow, technology, evidence, limitations and roadmap. If you cannot export a PPTX directly, provide complete slide-by-slide copy, layout specifications, editable chart data and speaker notes ready to paste into PowerPoint or Google Slides. Add concise speaker notes of about 25–35 seconds per slide and a one-page presenter Q&A note outside the slide count.

## Product identity and design

- Product: **Medsafe — Drug–Drug and Drug–Food Interaction Checker for Polypharmacy Patients**.
- Domain/track: Healthcare & Biotech; Bio-Pharma Safety.
- Audience: hackathon judges, technical and nontechnical. Tone: confident, honest, understandable on first reading.
- Visual language: professional clinical software, off-white background, deep teal and slate text, muted green for confirmed workflow steps, amber for pending items and restrained red only for a high-severity *fictional* example. Do not use exaggerated hospital imagery, invented logos, unsupported trust badges or decorative medical claims.
- 16:9 widescreen. Large readable headings, short labels, clean diagrams, editable vector shapes and charts. Prefer one key message and one main visual per slide. No dense paragraphs or tiny tables.
- Use actual supplied app screenshots if attached. If screenshots are absent, create clearly labelled **interface mockups** based only on the facts below. Do not invent features.
- Place a small persistent footer: **Technical prototype · fictional clinical data · not for patient decisions**.
- Use inclusive patient and caregiver illustrations without implying that a specific real patient or doctor used the system.

## Facts that must remain exact

Medsafe is a **working technical prototype**, not a clinical decision system. All sample medicine names, foods, interactions, doctor profiles and checkup values are fictional. The current graph contains **9 medicine nodes, 6 food nodes and 15 interaction edges**: **8 drug–drug and 7 drug–food**. The 15 edges are labelled **4 high, 6 moderate and 5 low** for demonstration. These are demo counts, not risk incidence or medical coverage.

The extended fictional case contains **3 prescriptions and 2 checkups** with **6 medicine names**. With a *fresh six-medicine list* plus Demo Herbal Tea and Demo Berry Bowl selected, it produces **7 fictional links**. An existing medicine list can produce more; never state seven as a guaranteed result for all users. The checkups contain synthetic numbers displayed as context; the software does **not** interpret laboratory values, diagnose disease or adjust a dose.

Workflow: upload images or PDFs → English browser OCR → user corrects and confirms text → match to fictional catalog → compare selected medicines and foods with typed graph edges → show severity, message and provenance → create unverified draft → show simulated two-doctor handoff → confirmation and browser print-to-PDF. A missing link is labelled “No sample link,” never “safe.” Unknown names are visibly excluded.

Technology: React 18, Vite 5, React Router 6, Node.js, Express 4, MySQL/mysql2, PDF.js for PDF page rendering, Tesseract.js for browser English OCR, SVG/CSS for charts and graph, Web Audio and optional browser Notifications for an open-tab reminder, Web Speech API for text-to-speech and optional dictated note. An opt-in RxNorm API query returns **candidate codes for one corrected medicine name**; the code is not automatically accepted and RxNorm is not the interaction source. Interface text and alert speech support English, Hindi and Tamil where browser voices are available. OCR itself currently uses English only; speech recognition support varies and may use a browser-provider service.

The current OCR benchmark uses **4 synthetic English prescription-like images**, with **8/8 fictional medicine names recalled** and **0 mean normalized character error rate** in the checked-in result. It is **not** an accuracy claim for real handwriting, Indian brands or regional scripts. Do not display “100% accurate on prescriptions.”

The two AI review connectors are **not connected**. The two doctor profiles and notes are **simulated**. There are **0/2 authenticated doctor approvals**, no real doctor has received the report, and patient-ready release is blocked. The printable output is labelled **UNVERIFIED DRAFT** and is not digitally signed. No validated substitute medicine is suggested.

Storage: MySQL has one seeded demo patient and fictional catalog/medicine records in API mode. Uploaded files and report text remain in current browser memory. Browser local storage holds reminders and last comparison; session storage holds only non-identifying report counts. When API/MySQL is unavailable, a labelled offline fictional sample workspace works in the frontend. This is not production health-data storage.

The current automated tests are **3 frontend tests and 23 backend tests**. The production frontend build passes. Do not call this clinical validation.

## Exactly 10 slides

1. **Title / one-line promise.** Headline: “Medsafe: one place to review a complex medicine list.” Subtitle with problem name and track. Visual: clean product dashboard screenshot or labelled mockup. Speaker note: 20-second pitch.
2. **The problem and user.** Visual: three prescriptions from different clinics converging on one elderly patient/caregiver, with unreadable handwriting and multiple languages. Short text: scattered information, missed review opportunities, unclear instructions. Cite WHO's polypharmacy report in a small source line. Do not invent an incidence statistic.
3. **What Medsafe does.** Visual: horizontal seven-step workflow — Collect → OCR → Correct → Match → Compare → Review → Unverified draft. Highlight the human correction and review gates. Add one line: “Potential findings for a clinician conversation, not automatic treatment changes.”
4. **System architecture.** Visual: two-lane diagram. Browser lane: React/Vite, PDF.js/Tesseract, graph visualization, speech, reminder and report. API lane: Express → MySQL fictional catalog and edges; optional RxNorm candidate lookup after opt-in. Indicate browser-memory documents and an offline sample fallback. Do not draw AI or doctors as connected services.
5. **OCR and identity workflow.** Visual: fictional prescription image → extracted editable text → matched name chip / unmatched name warning. Show upload limits (12 MB, 3 PDF pages). Add a compact evidence badge: “4 synthetic samples · 8/8 names recalled · real handwriting untested.”
6. **Graph and comparison.** Visual: editable network of medicine and food nodes, severity-coded edges, and a small 4/6/5 severity bar chart. Big number chips: **9 medicines / 6 foods / 15 demo links**. Show “No sample link ≠ safe.” Use only fictional sample names if labels are needed.
7. **Patient experience.** Visual: three small UI panels — dashboard, English/Hindi/Tamil alert text with listen button, and reminder timeline with bell. Explain the bell needs an open tab and notifications need permission. Do not imply guaranteed background reminders.
8. **Master report and doctor handoff.** Visual: 3 prescription cards + 2 checkup cards → unverified draft → two fictional reviewer cards. The most prominent number must be **0/2 authenticated approvals**. Include “Two AI connectors not connected” and “Patient-ready release blocked.”
9. **Live demonstration and measured evidence.** Visual: five-minute timeline showing the exact demo clicks: extended fictional case → confirm text → add six names → select two foods → run comparison → fill fictional doctor examples → view confirmation. Add a narrow evidence panel with “3 frontend tests, 23 backend tests; synthetic OCR only.” State the fresh-case seven-link count with its condition.
10. **Roadmap and close.** Visual: four milestones — licensed/versioned interaction evidence; consented real OCR benchmark and validated translations; secure identity, audit and privacy controls; independent AI proposals plus two authenticated clinician signatures. Closing sentence: “A safe workflow now; clinical evidence and human authorization before patient use.” End with a clear request for clinical-data and clinician-review partners, not a claim of deployment.

## Speaker notes and judge Q&A

- In notes, explain each technical component in plain English: “PDF.js renders pages; Tesseract reads image text; a person corrects it; MySQL stores fictional relationships; Express returns the selected links; React visualizes them.”
- Include likely questions and concise truthful answers in a one-page note: handwriting accuracy, unknown medicine, “no alert” meaning, RxNorm limitations for Indian brands, whether laboratory values are interpreted, what the two AI models do today, whether doctors actually approved, privacy/storage, reminders after tab closure, alternatives, how to deploy safely, and what must be validated next.
- Flag every current-versus-future boundary. Use phrases “fictional sample,” “simulated handoff,” “candidate code,” “unverified draft,” and “planned production integration.”
- The title “Dr. verification in process” is a **demo screen**; say explicitly that no real verification is in progress.

## Source links for small footnotes

- WHO, Medication safety in polypharmacy: https://www.who.int/publications/i/item/WHO-UHC-SDS-2019.11
- Tesseract.js PDF handling FAQ: https://github.com/naptha/tesseract.js/blob/master/docs/faq.md
- NLM RxNorm name-to-candidate API: https://www.lhncbc.nlm.nih.gov/RxNav/APIs/api-RxNorm.findRxcuiByString.html
- MDN SpeechRecognition availability/privacy: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- MDN Notifications API: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API

Before delivering, perform a **fact check against this prompt**. Remove any invented accuracy, patient outcome, real medicine recommendation, actual doctor approval, connected AI model, signed PDF, cloud deployment or production privacy claim. Then provide the editable PPTX or complete import-ready slides plus speaker notes.

