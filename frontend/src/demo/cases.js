// Demo patient cases: prescription + clinical report + optional user data.
// Names, doctors and clinics are fictional.

const item = (medId, raw, dose, freq, duration) => ({ medId, raw, dose, freq, duration });

export const CASES = [
  {
    id: 'ramesh',
    title: 'Elderly cardiac & kidney patient',
    tagline: 'AF, diabetes, CKD 3b',
    patient: {
      name: 'Ramesh Kumar', age: 68, sex: 'Male', weight: 74, pregnant: false, breastfeeding: false,
      allergies: [], conditions: ['hypertension', 'type2_diabetes', 'ckd', 'atrial_fibrillation', 'hyperlipidemia'],
      alcohol: true, smoking: false,
    },
    prescription: {
      doctor: 'Dr. A. Verma, MD (Medicine)', clinic: 'Sunrise Multispeciality Clinic, Lucknow', date: '02 Oct 2026',
      diagnosis: 'Lower respiratory tract infection; knee pain. K/c/o AF, T2DM, HTN, CKD',
      items: [
        item('warfarin', 'Tab. Warf 5 mg', '5 mg', 'Once daily (night)', 'Continue'),
        item('clarithromycin', 'Tab. Claribid 500', '500 mg', 'Twice daily', '7 days'),
        item('ibuprofen', 'Tab. Brufen 400', '400 mg', 'Three times daily after food', '5 days'),
        item('metformin', 'Tab. Glycomet 1 g', '1000 mg', 'Twice daily', 'Continue'),
        item('lisinopril', 'Tab. Listril 10', '10 mg', 'Once daily', 'Continue'),
        item('spironolactone', 'Tab. Aldactone 25', '25 mg', 'Once daily', 'Continue'),
        item('simvastatin', 'Tab. Simvotin 40', '40 mg', 'Once daily (night)', 'Continue'),
      ],
    },
    report: {
      lab: 'PathCare Diagnostics', date: '30 Sep 2026',
      labs: { egfr: 34, creatinine: 1.9, potassium: 5.4, sodium: 138, alt: 32, ast: 28, inr: 3.4, platelets: 210, hb: 11.8, glucose: 142, hba1c: 7.9, qtc: 448, heartRate: 78 },
    },
  },
  {
    id: 'priya',
    title: 'Pregnant patient with dengue',
    tagline: 'Pregnancy (2nd trimester), dengue, migraine',
    patient: {
      name: 'Priya Sharma', age: 29, sex: 'Female', weight: 58, pregnant: true, breastfeeding: false,
      allergies: [], conditions: ['dengue', 'migraine', 'depression'], alcohol: false, smoking: false,
    },
    prescription: {
      doctor: 'Dr. S. Iyer, MBBS', clinic: 'City Care Clinic, Pune', date: '04 Oct 2026',
      diagnosis: 'Fever with body ache (NS1 +ve), migraine headache, depression on treatment',
      items: [
        item('ibuprofen', 'Tab. Brufen 400', '400 mg', 'SOS for fever / pain', '3 days'),
        item('sumatriptan', 'Tab. Suminat 50', '50 mg', 'SOS for migraine', 'As needed'),
        item('sertraline', 'Tab. Serta 50', '50 mg', 'Once daily', 'Continue'),
        item('tramadol', 'Tab. Contramal 50', '50 mg', 'Twice daily', '3 days'),
        item('ondansetron', 'Tab. Emeset 4', '4 mg', 'SOS for vomiting', '3 days'),
        item('doxycycline', 'Cap. Doxy-1 100', '100 mg', 'Twice daily', '5 days'),
      ],
    },
    report: {
      lab: 'Metro Labs', date: '04 Oct 2026',
      labs: { platelets: 82, hb: 11.2, alt: 64, ast: 71, potassium: 4.1, sodium: 136, qtc: 440, heartRate: 92 },
    },
  },
  {
    id: 'abdul',
    title: 'Post-stent cardiac patient with asthma',
    tagline: 'CAD (stent), asthma, GERD',
    patient: {
      name: 'Abdul Rahman', age: 54, sex: 'Male', weight: 82, pregnant: false, breastfeeding: false,
      allergies: [], conditions: ['cad', 'asthma', 'gerd', 'hypertension'], alcohol: false, smoking: true,
    },
    prescription: {
      doctor: 'Dr. R. Menon, DM (Cardiology)', clinic: 'HeartLine Hospital, Kochi', date: '28 Sep 2026',
      diagnosis: 'CAD s/p PCI (Aug 2026), bronchial asthma, GERD, UTI',
      items: [
        item('aspirin', 'Tab. Ecosprin 75', '75 mg', 'Once daily after lunch', 'Continue'),
        item('clopidogrel', 'Tab. Clopilet 75', '75 mg', 'Once daily', '12 months'),
        item('omeprazole', 'Cap. Omez 20', '20 mg', 'Before breakfast', 'Continue'),
        item('atorvastatin', 'Tab. Atorva 40', '40 mg', 'Once daily (night)', 'Continue'),
        item('propranolol', 'Tab. Ciplar 40', '40 mg', 'Twice daily', 'Continue'),
        item('isosorbide', 'Tab. Monotrate 20', '20 mg', 'Twice daily', 'Continue'),
        item('sildenafil', 'Tab. Penegra 50', '50 mg', 'SOS', 'As needed'),
        item('theophylline', 'Tab. Deriphyllin retard 150', '150 mg', 'Twice daily', 'Continue'),
        item('ciprofloxacin', 'Tab. Ciplox 500', '500 mg', 'Twice daily', '5 days'),
      ],
    },
    report: {
      lab: 'Aster Labs', date: '27 Sep 2026',
      labs: { egfr: 82, potassium: 4.2, sodium: 140, alt: 38, inr: 1.0, platelets: 240, hb: 14.1, qtc: 452, heartRate: 58 },
    },
  },
  {
    id: 'kamla',
    title: 'Elderly woman, multiple medicines',
    tagline: 'Age 76, glaucoma, depression, OA',
    patient: {
      name: 'Kamla Devi', age: 76, sex: 'Female', weight: 52, pregnant: false, breastfeeding: false,
      allergies: ['sulfa'], conditions: ['depression', 'insomnia', 'hypothyroidism', 'osteoarthritis', 'osteoporosis', 'glaucoma'],
      alcohol: false, smoking: false,
    },
    prescription: {
      doctor: 'Dr. P. Banerjee, MD', clinic: 'Seva Family Clinic, Kolkata', date: '01 Oct 2026',
      diagnosis: 'Low mood, poor sleep, knee OA, hypothyroid, allergic cold',
      items: [
        item('amitriptyline', 'Tab. Tryptomer 25', '25 mg', 'At bedtime', '1 month'),
        item('alprazolam', 'Tab. Alprax 0.5', '0.5 mg', 'At bedtime', '1 month'),
        item('levothyroxine', 'Tab. Thyronorm 50', '50 mcg', 'Morning', 'Continue'),
        item('calcium_carbonate', 'Tab. Shelcal 500', '500 mg', 'Twice daily', 'Continue'),
        item('diclofenac', 'Tab. Voveran 50', '50 mg', 'Twice daily', '10 days'),
        item('chlorpheniramine', 'Tab. Cadistin 4', '4 mg', 'Three times daily', '5 days'),
        item('pantoprazole', 'Tab. Pan 40', '40 mg', 'Before breakfast', '1 month'),
      ],
    },
    report: {
      lab: 'Suraksha Diagnostics', date: '29 Sep 2026',
      labs: { egfr: 52, creatinine: 1.1, sodium: 128, potassium: 3.9, tsh: 6.2, alt: 22, hb: 10.8, glucose: 96, heartRate: 70 },
    },
  },
  {
    id: 'arjun',
    title: 'TB patient with epilepsy',
    tagline: 'Pulmonary TB, epilepsy, penicillin allergy',
    patient: {
      name: 'Arjun Mehta', age: 41, sex: 'Male', weight: 61, pregnant: false, breastfeeding: false,
      allergies: ['penicillin'], conditions: ['tuberculosis', 'epilepsy', 'hepatitis_b'], alcohol: true, smoking: true,
    },
    prescription: {
      doctor: 'Dr. K. Reddy, MD (Pulmonology)', clinic: 'Lifeline Chest Centre, Hyderabad', date: '03 Oct 2026',
      diagnosis: 'Sputum +ve pulmonary TB (intensive phase); seizure disorder; dental infection',
      items: [
        item('rifampicin', 'Cap. R-Cin 450', '450 mg', 'Empty stomach, morning', '2 months'),
        item('isoniazid', 'Tab. Isokin 300', '300 mg', 'Morning', '2 months'),
        item('pyrazinamide', 'Tab. PZA 1500', '1500 mg', 'Morning', '2 months'),
        item('carbamazepine', 'Tab. Tegretol 200', '200 mg', 'Twice daily', 'Continue'),
        item('amoxicillin', 'Cap. Mox 500', '500 mg', 'Three times daily', '5 days'),
        item('paracetamol', 'Tab. Dolo 650', '650 mg', 'SOS', 'As needed'),
      ],
    },
    report: {
      lab: 'Vijaya Diagnostics', date: '02 Oct 2026',
      labs: { alt: 146, ast: 132, sodium: 131, potassium: 4.0, platelets: 190, hb: 12.4, egfr: 95 },
    },
  },
  {
    id: 'neha',
    title: 'Young adult, simple prescription',
    tagline: 'Sore throat & allergic rhinitis',
    patient: {
      name: 'Neha Gupta', age: 24, sex: 'Female', weight: 55, pregnant: false, breastfeeding: false,
      allergies: [], conditions: ['allergic_rhinitis'], alcohol: false, smoking: false,
    },
    prescription: {
      doctor: 'Dr. M. Khan, MBBS', clinic: 'Wellness Point Clinic, Delhi', date: '05 Oct 2026',
      diagnosis: 'Acute pharyngitis with allergic rhinitis',
      items: [
        item('amoxicillin', 'Cap. Novamox 500', '500 mg', 'Three times daily', '5 days'),
        item('paracetamol', 'Tab. Crocin 500', '500 mg', 'SOS for fever', '3 days'),
        item('cetirizine', 'Tab. Cetzine 10', '10 mg', 'At night', '5 days'),
      ],
    },
    report: {
      lab: 'Dr. Lal PathLabs', date: '05 Oct 2026',
      labs: { hb: 12.8, platelets: 260, alt: 24, egfr: 110, potassium: 4.2 },
    },
  },
];

export const EMPTY_CASE = {
  id: 'custom',
  title: 'Custom patient',
  tagline: 'Upload your own prescription and enter data',
  patient: { name: '', age: '', sex: '', weight: '', pregnant: false, breastfeeding: false, allergies: [], conditions: [], alcohol: false, smoking: false },
  prescription: { doctor: '', clinic: '', date: '', diagnosis: '', items: [] },
  report: { lab: '', date: '', labs: {} },
};

export function findCaseForFile(fileName) {
  const name = fileName.toLowerCase();
  return CASES.find((c) => name.includes(c.id) || name.includes(c.patient.name.split(' ')[0].toLowerCase()));
}
