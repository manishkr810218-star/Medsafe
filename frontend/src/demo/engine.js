import { MED_BY_ID } from './medicines.js';
import { DISEASE_BY_ID } from './diseases.js';
import {
  DRUG_DRUG, DRUG_FOOD, DRUG_DISEASE, LAB_RULES, LAB_RANGES, BEERS_ALT, ALLERGY_OPTIONS, ALLOWED_SAME_CLASS,
} from './rules.js';

const SEV_RANK = { high: 3, moderate: 2, low: 1 };
const toList = (s) => (Array.isArray(s) ? s : [s]);

export function matches(med, sel) {
  return toList(sel).some((s) => {
    const [kind, val] = s.split(':');
    if (kind === 'id') return med.id === val;
    if (kind === 'cls') return med.cls === val;
    if (kind === 'tag') return med.tags.includes(val);
    return false;
  });
}

const bump = (sev) => (sev === 'low' ? 'moderate' : 'high');

export function labStatus(key, value) {
  const range = LAB_RANGES[key];
  if (value === '' || value == null || Number.isNaN(Number(value)) || !range) return null;
  const v = Number(value);
  if (range.low != null && v < range.low) return 'low';
  if (range.high != null && v > range.high) return 'high';
  return 'normal';
}

export function analyze({ items, patient, labs }) {
  const meds = items.map((it) => MED_BY_ID[it.medId]).filter(Boolean);
  const alerts = [];
  const safePairs = [];
  const push = (a) => alerts.push({ key: `${a.type}-${alerts.length}`, ...a });

  // Drug-drug
  for (let i = 0; i < meds.length; i += 1) {
    for (let j = i + 1; j < meds.length; j += 1) {
      const A = meds[i];
      const B = meds[j];
      const pair = `${A.name} + ${B.name}`;
      const topics = new Set();

      if (A.id === B.id) {
        push({ type: 'duplicate', sev: 'moderate', title: `${A.name} listed twice`, subtitle: 'Duplicate entry',
          msg: 'The same medicine appears more than once on the prescription.', advice: 'Confirm the intended dose and remove the duplicate.', meds: [A.name] });
        continue;
      }
      if (A.cls === B.cls && !ALLOWED_SAME_CLASS.has(A.cls)) {
        topics.add('dup');
        push({ type: 'duplicate', sev: 'moderate', title: pair, subtitle: 'Duplicate therapy (same drug class)',
          msg: `Both medicines belong to the same group (${A.category.toLowerCase()}). Taking two adds side-effects without extra benefit.`,
          advice: 'Keep one medicine from this class.', meds: [A.name, B.name] });
      }

      for (const r of DRUG_DRUG) {
        if (topics.has(r.topic)) continue;
        const hit = (matches(A, r.a) && matches(B, r.b)) || (matches(B, r.a) && matches(A, r.b));
        if (!hit) continue;
        topics.add(r.topic);
        push({ type: 'drug-drug', sev: r.sev, title: pair, subtitle: r.title, msg: r.msg, advice: r.advice, alt: r.alt, meds: [A.name, B.name] });
      }
      if (topics.size === 0) safePairs.push(pair);
    }
  }

  // Multi-drug burden rules
  const count = (sel) => meds.filter((x) => matches(x, sel)).length;
  const names = (sel) => meds.filter((x) => matches(x, sel)).map((x) => x.name);
  if (count('cls:nsaid') && count(['cls:acei', 'cls:arb']) && count(['cls:loop', 'cls:thiazide', 'cls:k_sparing'])) {
    const ms = names(['cls:nsaid', 'cls:acei', 'cls:arb', 'cls:loop', 'cls:thiazide', 'cls:k_sparing']);
    push({ type: 'drug-drug', sev: 'high', title: ms.join(' + '), subtitle: '"Triple whammy" acute kidney injury',
      msg: 'An NSAID combined with an ACE inhibitor/ARB and a diuretic is a well-known cause of sudden kidney failure.',
      advice: 'Stop the NSAID and check creatinine.', alt: 'Paracetamol for pain.', meds: ms });
  }
  if (count('tag:qt') >= 3) {
    push({ type: 'drug-drug', sev: 'high', title: names('tag:qt').join(' + '), subtitle: 'High QT-prolongation burden',
      msg: `${count('tag:qt')} medicines on this prescription prolong the QT interval.`, advice: 'Get an ECG and remove non-essential QT-prolonging drugs.', meds: names('tag:qt') });
  }
  if (count('tag:anticholinergic') + count('tag:cns') >= 3 && count('tag:cns') >= 2) {
    push({ type: 'patient', sev: 'moderate', title: names(['tag:cns', 'tag:anticholinergic']).join(' + '), subtitle: 'Sedative / anticholinergic load',
      msg: 'Several medicines cause drowsiness or confusion; combined load raises the risk of falls and delirium.', advice: 'Deprescribe where possible, especially in older adults.',
      meds: names(['tag:cns', 'tag:anticholinergic']) });
  }

  // Drug-food
  for (const med of meds) {
    for (const r of DRUG_FOOD) {
      if (!matches(med, r.sel)) continue;
      const personal = r.food.startsWith('Alcohol') && patient.alcohol;
      push({ type: 'drug-food', sev: personal ? bump(r.sev) : r.sev, title: `${med.name} + ${r.food}`, subtitle: 'Food / lifestyle interaction',
        msg: r.msg + (personal ? ' The patient reports regular alcohol use.' : ''), advice: r.advice, meds: [med.name], food: r.food, personal });
    }
  }

  // Drug-disease
  const conditions = new Set(patient.conditions);
  if (patient.pregnant) conditions.add('pregnancy');
  if (patient.breastfeeding) conditions.add('breastfeeding');
  for (const med of meds) {
    const seen = new Set();
    for (const r of DRUG_DISEASE) {
      if (!matches(med, r.sel)) continue;
      for (const dz of r.diseases) {
        if (!conditions.has(dz) || seen.has(dz)) continue;
        seen.add(dz);
        push({ type: 'drug-disease', sev: r.sev, title: `${med.name} in ${DISEASE_BY_ID[dz]?.name ?? dz}`, subtitle: 'Drug-disease caution',
          msg: r.msg, advice: r.advice, alt: r.alt, meds: [med.name] });
      }
    }
  }

  // Lab report
  const labSeen = new Set();
  for (const r of LAB_RULES) {
    const raw = labs[r.lab];
    if (raw === '' || raw == null) continue;
    const v = Number(raw);
    if (Number.isNaN(v) || !(r.op === '>' ? v > r.value : v < r.value)) continue;
    for (const med of meds) {
      const key = `${med.id}-${r.lab}`;
      if (labSeen.has(key) || !matches(med, r.sel)) continue;
      labSeen.add(key);
      const range = LAB_RANGES[r.lab];
      push({ type: 'lab', sev: r.sev, title: `${med.name} with ${range.label} ${v}${range.unit ? ` ${range.unit}` : ''}`,
        subtitle: 'Clinical report finding', msg: r.msg, advice: r.advice, alt: r.alt, meds: [med.name] });
    }
  }

  // Patient-specific: age, allergies, smoking
  const age = Number(patient.age);
  if (age >= 65) {
    for (const med of meds.filter((x) => x.tags.includes('beers'))) {
      push({ type: 'patient', sev: 'moderate', title: `${med.name} at age ${age}`, subtitle: 'Potentially inappropriate in older adults (Beers criteria)',
        msg: 'Older adults are more sensitive to this medicine (falls, confusion, bleeding or low sugar).', advice: 'Use the lowest dose for the shortest time.',
        alt: BEERS_ALT[med.cls], meds: [med.name] });
    }
  }
  if (age && age < 16) {
    meds.filter((x) => x.id === 'aspirin').forEach((med) => push({ type: 'patient', sev: 'high', title: `${med.name} in a child`, subtitle: 'Reye\u2019s syndrome risk',
      msg: 'Aspirin in children with viral illness can cause Reye\u2019s syndrome.', advice: 'Avoid aspirin under 16.', alt: 'Paracetamol.', meds: [med.name] }));
  }
  if (age && age < 8) {
    meds.filter((x) => x.cls === 'tetracycline').forEach((med) => push({ type: 'patient', sev: 'high', title: `${med.name} under age 8`, subtitle: 'Tooth discolouration',
      msg: 'Tetracyclines permanently stain developing teeth.', advice: 'Avoid under 8 years.', meds: [med.name] }));
  }
  for (const allergyId of patient.allergies) {
    const allergy = ALLERGY_OPTIONS.find((a) => a.id === allergyId);
    if (!allergy) continue;
    for (const med of meds) {
      if (matches(med, allergy.high)) {
        push({ type: 'patient', sev: 'high', title: `${med.name} - ${allergy.label} allergy`, subtitle: 'Allergy conflict',
          msg: `The patient has a recorded ${allergy.label.toLowerCase()} allergy and this medicine belongs to that group.`, advice: 'Do not give. Choose a different class.',
          alt: allergy.id === 'penicillin' ? 'Azithromycin or doxycycline, depending on the infection.' : undefined, meds: [med.name] });
      } else if (allergy.low && matches(med, allergy.low)) {
        push({ type: 'patient', sev: 'low', title: `${med.name} - ${allergy.label} allergy`, subtitle: 'Possible cross-reactivity',
          msg: 'Small chance of cross-reaction with the recorded allergy.', advice: 'Give the first dose under observation.', meds: [med.name] });
      }
    }
  }
  if (patient.smoking) {
    meds.filter((x) => ['theophylline', 'olanzapine'].includes(x.id)).forEach((med) => push({ type: 'patient', sev: 'low', title: `${med.name} and smoking`,
      subtitle: 'Lifestyle effect', msg: 'Smoking speeds up breakdown of this medicine; quitting suddenly can raise levels.', advice: 'Review dose if smoking habits change.', meds: [med.name] }));
  }

  alerts.sort((a, b) => SEV_RANK[b.sev] - SEV_RANK[a.sev]);

  const counts = { high: 0, moderate: 0, low: 0 };
  alerts.forEach((a) => { counts[a.sev] += 1; });
  const score = Math.min(100, counts.high * 18 + counts.moderate * 6 + counts.low * 2);
  const level = score >= 60 ? 'high' : score >= 25 ? 'moderate' : 'low';

  const findings = Object.entries(labs)
    .map(([key, value]) => ({ key, value, status: labStatus(key, value), ...LAB_RANGES[key] }))
    .filter((f) => f.status);

  const seenActions = new Set();
  const actions = alerts
    .filter((a) => a.sev !== 'low')
    .map((a) => ({ sev: a.sev, text: a.alt ? `${a.advice} Alternative: ${a.alt}` : a.advice, about: a.meds.join(', ') }))
    .filter((a) => (seenActions.has(a.text) ? false : seenActions.add(a.text)))
    .slice(0, 8);

  return { alerts, counts, score, level, safePairs, findings, actions, medCount: meds.length };
}
