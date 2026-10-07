// Demo-only list of conditions a patient can have. Used for drug-disease checks.
const d = (id, name, category) => ({ id, name, category });

export const DISEASES = [
  d('hypertension', 'Hypertension', 'Heart & blood'),
  d('cad', 'Coronary artery disease / post-stent', 'Heart & blood'),
  d('heart_failure', 'Heart failure', 'Heart & blood'),
  d('atrial_fibrillation', 'Atrial fibrillation', 'Heart & blood'),
  d('bradycardia', 'Bradycardia / heart block', 'Heart & blood'),
  d('long_qt', 'Long QT syndrome', 'Heart & blood'),
  d('stroke_history', 'Previous stroke', 'Heart & blood'),
  d('hyperlipidemia', 'High cholesterol', 'Heart & blood'),
  d('bleeding_disorder', 'Bleeding disorder', 'Heart & blood'),
  d('anemia', 'Anaemia', 'Heart & blood'),
  d('type2_diabetes', 'Type 2 diabetes', 'Endocrine'),
  d('type1_diabetes', 'Type 1 diabetes', 'Endocrine'),
  d('hypothyroidism', 'Hypothyroidism', 'Endocrine'),
  d('hyperthyroidism', 'Hyperthyroidism', 'Endocrine'),
  d('obesity', 'Obesity', 'Endocrine'),
  d('ckd', 'Chronic kidney disease', 'Kidney & liver'),
  d('liver_cirrhosis', 'Liver cirrhosis / liver disease', 'Kidney & liver'),
  d('hepatitis_b', 'Hepatitis B', 'Kidney & liver'),
  d('fatty_liver', 'Fatty liver (NAFLD)', 'Kidney & liver'),
  d('asthma', 'Asthma', 'Lungs'),
  d('copd', 'COPD', 'Lungs'),
  d('sleep_apnea', 'Sleep apnoea', 'Lungs'),
  d('tuberculosis', 'Tuberculosis', 'Infection'),
  d('dengue', 'Dengue fever', 'Infection'),
  d('malaria', 'Malaria', 'Infection'),
  d('typhoid', 'Typhoid', 'Infection'),
  d('uti', 'Urinary tract infection', 'Infection'),
  d('pneumonia', 'Pneumonia', 'Infection'),
  d('peptic_ulcer', 'Peptic ulcer / GI bleed history', 'Stomach'),
  d('gerd', 'Acid reflux (GERD)', 'Stomach'),
  d('ibs', 'Irritable bowel syndrome', 'Stomach'),
  d('epilepsy', 'Epilepsy / seizures', 'Brain & mind'),
  d('migraine', 'Migraine', 'Brain & mind'),
  d('parkinsons', 'Parkinson\u2019s disease', 'Brain & mind'),
  d('dementia', 'Dementia', 'Brain & mind'),
  d('depression', 'Depression', 'Brain & mind'),
  d('anxiety', 'Anxiety', 'Brain & mind'),
  d('bipolar', 'Bipolar disorder', 'Brain & mind'),
  d('schizophrenia', 'Schizophrenia', 'Brain & mind'),
  d('insomnia', 'Insomnia', 'Brain & mind'),
  d('myasthenia', 'Myasthenia gravis', 'Brain & mind'),
  d('glaucoma', 'Angle-closure glaucoma', 'Eyes'),
  d('bph', 'Enlarged prostate (BPH)', 'Urinary'),
  d('urinary_retention', 'Urinary retention', 'Urinary'),
  d('gout', 'Gout', 'Joints & bones'),
  d('osteoarthritis', 'Osteoarthritis', 'Joints & bones'),
  d('rheumatoid_arthritis', 'Rheumatoid arthritis', 'Joints & bones'),
  d('osteoporosis', 'Osteoporosis', 'Joints & bones'),
  d('lupus', 'Lupus (SLE)', 'Joints & bones'),
  d('psoriasis', 'Psoriasis', 'Skin'),
  d('allergic_rhinitis', 'Allergic rhinitis', 'Allergy'),
  d('g6pd', 'G6PD deficiency', 'Genetic'),
  d('pregnancy', 'Pregnancy', 'Life stage'),
  d('breastfeeding', 'Breastfeeding', 'Life stage'),
];

export const DISEASE_BY_ID = Object.fromEntries(DISEASES.map((x) => [x.id, x]));

export function searchDiseases(query, exclude = [], limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return DISEASES.filter(
    (x) => !exclude.includes(x.id) && (x.name.toLowerCase().includes(q) || x.category.toLowerCase().includes(q)),
  ).slice(0, limit);
}
