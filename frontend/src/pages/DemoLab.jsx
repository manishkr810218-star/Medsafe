import { useEffect, useMemo, useRef, useState } from 'react';
import { CASES, EMPTY_CASE, findCaseForFile } from '../demo/cases.js';
import { analyze } from '../demo/engine.js';
import { MEDICINES } from '../demo/medicines.js';
import { DISEASES } from '../demo/diseases.js';
import CasePicker from '../components/demo/CasePicker.jsx';
import PrescriptionScan from '../components/demo/PrescriptionScan.jsx';
import ExtractedMeds from '../components/demo/ExtractedMeds.jsx';
import PatientPanel from '../components/demo/PatientPanel.jsx';
import ClinicalReport from '../components/demo/ClinicalReport.jsx';
import SafetyReport from '../components/demo/SafetyReport.jsx';
import StepHeading from '../components/demo/StepHeading.jsx';

const getCase = (id) => (id === EMPTY_CASE.id ? EMPTY_CASE : CASES.find((c) => c.id === id));
const SCAN_MS = 1800;

export default function DemoLab() {
  const [caseId, setCaseId] = useState(CASES[0].id);
  const [patient, setPatient] = useState(() => structuredClone(CASES[0].patient));
  const [labs, setLabs] = useState(() => ({ ...CASES[0].report.labs }));
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  const [file, setFile] = useState(null);
  const timer = useRef(null);
  const resultsRef = useRef(null);
  const current = getCase(caseId);

  useEffect(() => () => clearTimeout(timer.current), []);

  function selectCase(id) {
    const c = getCase(id);
    clearTimeout(timer.current);
    setCaseId(id);
    setPatient(structuredClone(c.patient));
    setLabs({ ...c.report.labs });
    setItems([]);
    setStatus('idle');
    setFile(null);
  }

  function handleFile(f) {
    const match = f && findCaseForFile(f.name);
    if (match && match.id !== caseId) selectCase(match.id);
    setFile(f);
    setStatus('idle');
    setItems([]);
  }

  function scan() {
    setStatus('scanning');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setItems(current.prescription.items.map((x) => ({ ...x })));
      setStatus('done');
      timer.current = setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }, SCAN_MS);
  }

  const result = useMemo(
    () => (status === 'done' && items.length > 0 ? analyze({ items, patient, labs }) : null),
    [status, items, patient, labs],
  );

  return (
    <div className="demo">
      <header className="demo-hero">
        <div>
          <span className="eyebrow">Judges demo</span>
          <h1>Prescription Safety Lab</h1>
          <p className="muted">
            Pick a sample patient or upload a prescription. MedSafe reads the medicines, combines them with the
            clinical report and patient details, and runs drug-drug, drug-food, drug-disease, lab and allergy checks.
          </p>
        </div>
        <dl className="hero-stats">
          <div><dt>Medicines</dt><dd>{MEDICINES.length}</dd></div>
          <div><dt>Conditions</dt><dd>{DISEASES.length}</dd></div>
          <div><dt>Sample cases</dt><dd>{CASES.length}</dd></div>
        </dl>
      </header>

      <section aria-labelledby="step-1">
        <StepHeading id="step-1" n={1} title="Choose a patient case" hint="Each case has a prescription, a clinical report and patient details." />
        <CasePicker cases={CASES} custom={EMPTY_CASE} selectedId={caseId} onSelect={selectCase} />
      </section>

      <section aria-labelledby="step-2">
        <StepHeading id="step-2" n={2} title="Upload and scan the prescription" hint="Tip: name the file after a case (e.g. ramesh.jpg) to auto-select it." />
        <div className="split">
          <PrescriptionScan caseData={current} patient={patient} file={file} onFile={handleFile} status={status} onScan={scan} />
          <ExtractedMeds items={items} setItems={setItems} status={status} />
        </div>
      </section>

      <section aria-labelledby="step-3">
        <StepHeading id="step-3" n={3} title="Clinical report and patient details" hint="Optional. Edit any value and the safety report updates instantly." />
        <div className="split">
          <ClinicalReport report={current.report} labs={labs} setLabs={setLabs} />
          <PatientPanel patient={patient} setPatient={setPatient} />
        </div>
      </section>

      <section aria-labelledby="step-4" ref={resultsRef} className="scroll-target">
        <StepHeading id="step-4" n={4} title="Safety report" hint="All findings are confirmed against the demo database." />
        {result ? (
          <SafetyReport result={result} patient={patient} />
        ) : (
          <div className="card empty-state">
            <p>{status === 'done' ? 'Add at least one medicine to run the checks.' : 'Scan the prescription in step 2 to generate the safety report.'}</p>
          </div>
        )}
      </section>

      <p className="demo-note small muted">
        Demo dataset for prototype presentation. Medicine names are real, but the rules are simplified and the
        scan is simulated, so this is not medical advice.
      </p>
    </div>
  );
}
