// Demo-only medicine catalogue (~120 entries). Real generic names are used so the
// demo feels realistic, but the data is simplified and is NOT medical advice.
//
// Tags drive the rule engine:
//  bleeding, qt, serotonergic, cns, hyperkalemia, hypokalemia, hyponatremia, hypoglycemia,
//  hepatotoxic, renal (needs renal dose adjustment), anticholinergic, beers, bradycardia,
//  seizure, cyp3a4_strong (strong inhibitor), cyp3a4_sub (sensitive substrate), inducer

const m = (id, name, brand, cls, category, dose, tags = []) => ({ id, name, brand, cls, category, dose, tags });

export const MEDICINES = [
  // Pain / inflammation
  m('paracetamol', 'Paracetamol', 'Crocin, Dolo 650', 'analgesic', 'Pain & fever', '500-650 mg', ['hepatotoxic']),
  m('ibuprofen', 'Ibuprofen', 'Brufen', 'nsaid', 'Pain & fever', '400 mg', ['bleeding', 'beers']),
  m('diclofenac', 'Diclofenac', 'Voveran', 'nsaid', 'Pain & fever', '50 mg', ['bleeding', 'beers', 'hepatotoxic']),
  m('naproxen', 'Naproxen', 'Naprosyn', 'nsaid', 'Pain & fever', '250-500 mg', ['bleeding', 'beers']),
  m('aceclofenac', 'Aceclofenac', 'Zerodol', 'nsaid', 'Pain & fever', '100 mg', ['bleeding', 'beers']),
  m('etoricoxib', 'Etoricoxib', 'Etoshine', 'nsaid', 'Pain & fever', '60-90 mg', ['bleeding']),
  m('mefenamic', 'Mefenamic acid', 'Meftal', 'nsaid', 'Pain & fever', '500 mg', ['bleeding', 'beers']),
  m('tramadol', 'Tramadol', 'Ultracet, Contramal', 'opioid', 'Pain & fever', '50 mg', ['serotonergic', 'cns', 'seizure']),
  m('codeine', 'Codeine', 'Codokuff', 'opioid', 'Pain & fever', '15-30 mg', ['cns']),
  m('morphine', 'Morphine', 'Morcontin', 'opioid', 'Pain & fever', '10 mg', ['cns']),
  m('sumatriptan', 'Sumatriptan', 'Suminat', 'triptan', 'Neurology', '50 mg', ['serotonergic']),

  // Blood thinners
  m('aspirin', 'Aspirin', 'Ecosprin', 'antiplatelet', 'Heart & blood', '75-150 mg', ['bleeding']),
  m('clopidogrel', 'Clopidogrel', 'Clopilet', 'p2y12', 'Heart & blood', '75 mg', ['bleeding']),
  m('ticagrelor', 'Ticagrelor', 'Brilinta', 'p2y12', 'Heart & blood', '90 mg', ['bleeding', 'cyp3a4_sub']),
  m('warfarin', 'Warfarin', 'Warf, Coumadin', 'anticoagulant', 'Heart & blood', '1-10 mg', ['bleeding']),
  m('apixaban', 'Apixaban', 'Eliquis', 'anticoagulant', 'Heart & blood', '5 mg', ['bleeding', 'cyp3a4_sub']),
  m('rivaroxaban', 'Rivaroxaban', 'Xarelto', 'anticoagulant', 'Heart & blood', '15-20 mg', ['bleeding', 'cyp3a4_sub']),
  m('dabigatran', 'Dabigatran', 'Pradaxa', 'anticoagulant', 'Heart & blood', '110-150 mg', ['bleeding', 'renal']),

  // Cardiovascular
  m('atorvastatin', 'Atorvastatin', 'Atorva, Lipitor', 'statin', 'Cholesterol', '10-80 mg', ['cyp3a4_sub']),
  m('rosuvastatin', 'Rosuvastatin', 'Rosuvas, Crestor', 'statin', 'Cholesterol', '5-20 mg'),
  m('simvastatin', 'Simvastatin', 'Simvotin', 'statin', 'Cholesterol', '20-40 mg', ['cyp3a4_sub']),
  m('amlodipine', 'Amlodipine', 'Amlong, Stamlo', 'ccb_dhp', 'Blood pressure', '5-10 mg', ['cyp3a4_sub']),
  m('nifedipine', 'Nifedipine', 'Depin', 'ccb_dhp', 'Blood pressure', '10-30 mg', ['cyp3a4_sub']),
  m('diltiazem', 'Diltiazem', 'Dilzem', 'ccb_ndhp', 'Blood pressure', '30-90 mg', ['bradycardia']),
  m('verapamil', 'Verapamil', 'Calaptin', 'ccb_ndhp', 'Blood pressure', '40-80 mg', ['bradycardia']),
  m('metoprolol', 'Metoprolol', 'Metolar, Betaloc', 'beta_blocker', 'Blood pressure', '25-50 mg', ['bradycardia']),
  m('atenolol', 'Atenolol', 'Aten, Tenormin', 'beta_blocker', 'Blood pressure', '25-50 mg', ['bradycardia', 'renal']),
  m('propranolol', 'Propranolol', 'Inderal, Ciplar', 'beta_blocker', 'Blood pressure', '10-40 mg', ['bradycardia', 'nonselective_bb']),
  m('bisoprolol', 'Bisoprolol', 'Concor', 'beta_blocker', 'Blood pressure', '2.5-10 mg', ['bradycardia']),
  m('carvedilol', 'Carvedilol', 'Carca, Cardivas', 'beta_blocker', 'Blood pressure', '3.125-25 mg', ['bradycardia', 'nonselective_bb']),
  m('enalapril', 'Enalapril', 'Envas', 'acei', 'Blood pressure', '5-20 mg', ['hyperkalemia']),
  m('lisinopril', 'Lisinopril', 'Listril', 'acei', 'Blood pressure', '5-20 mg', ['hyperkalemia']),
  m('ramipril', 'Ramipril', 'Cardace', 'acei', 'Blood pressure', '2.5-10 mg', ['hyperkalemia']),
  m('losartan', 'Losartan', 'Losar, Repace', 'arb', 'Blood pressure', '25-100 mg', ['hyperkalemia']),
  m('telmisartan', 'Telmisartan', 'Telma', 'arb', 'Blood pressure', '40-80 mg', ['hyperkalemia']),
  m('olmesartan', 'Olmesartan', 'Olmezest', 'arb', 'Blood pressure', '20-40 mg', ['hyperkalemia']),
  m('hydrochlorothiazide', 'Hydrochlorothiazide', 'Aquazide', 'thiazide', 'Blood pressure', '12.5-25 mg', ['hypokalemia', 'hyponatremia']),
  m('chlorthalidone', 'Chlorthalidone', 'Thalizide', 'thiazide', 'Blood pressure', '6.25-25 mg', ['hypokalemia', 'hyponatremia']),
  m('furosemide', 'Furosemide', 'Lasix', 'loop', 'Heart & kidney', '20-40 mg', ['hypokalemia']),
  m('torsemide', 'Torsemide', 'Dytor', 'loop', 'Heart & kidney', '10-20 mg', ['hypokalemia']),
  m('spironolactone', 'Spironolactone', 'Aldactone', 'k_sparing', 'Heart & kidney', '25-50 mg', ['hyperkalemia']),
  m('isosorbide', 'Isosorbide mononitrate', 'Monotrate', 'nitrate', 'Heart & blood', '20-30 mg'),
  m('nitroglycerin', 'Nitroglycerin (GTN)', 'Nitrocontin, Sorbitrate', 'nitrate', 'Heart & blood', '0.5 mg SL'),
  m('digoxin', 'Digoxin', 'Lanoxin', 'glycoside', 'Heart & blood', '0.125-0.25 mg', ['renal', 'bradycardia', 'beers']),
  m('amiodarone', 'Amiodarone', 'Cordarone', 'antiarrhythmic', 'Heart & blood', '100-200 mg', ['qt', 'bradycardia', 'hepatotoxic']),

  // Diabetes & thyroid
  m('metformin', 'Metformin', 'Glycomet, Glucophage', 'biguanide', 'Diabetes', '500-1000 mg', ['renal']),
  m('glimepiride', 'Glimepiride', 'Amaryl', 'sulfonylurea', 'Diabetes', '1-4 mg', ['hypoglycemia']),
  m('gliclazide', 'Gliclazide', 'Diamicron', 'sulfonylurea', 'Diabetes', '40-80 mg', ['hypoglycemia']),
  m('glibenclamide', 'Glibenclamide', 'Daonil', 'sulfonylurea', 'Diabetes', '2.5-5 mg', ['hypoglycemia', 'beers']),
  m('sitagliptin', 'Sitagliptin', 'Januvia, Istavel', 'dpp4', 'Diabetes', '50-100 mg', ['renal']),
  m('vildagliptin', 'Vildagliptin', 'Galvus', 'dpp4', 'Diabetes', '50 mg'),
  m('empagliflozin', 'Empagliflozin', 'Jardiance', 'sglt2', 'Diabetes', '10-25 mg'),
  m('dapagliflozin', 'Dapagliflozin', 'Forxiga', 'sglt2', 'Diabetes', '10 mg'),
  m('insulin_glargine', 'Insulin glargine', 'Lantus, Basalog', 'insulin', 'Diabetes', '10-30 units', ['hypoglycemia']),
  m('insulin_regular', 'Regular insulin', 'Actrapid, Huminsulin R', 'insulin', 'Diabetes', 'as per sugar', ['hypoglycemia']),
  m('levothyroxine', 'Levothyroxine', 'Thyronorm, Eltroxin', 'thyroid', 'Thyroid', '25-100 mcg'),

  // Stomach
  m('omeprazole', 'Omeprazole', 'Omez', 'ppi', 'Stomach', '20 mg'),
  m('pantoprazole', 'Pantoprazole', 'Pan 40, Pantocid', 'ppi', 'Stomach', '40 mg'),
  m('esomeprazole', 'Esomeprazole', 'Nexpro', 'ppi', 'Stomach', '20-40 mg'),
  m('rabeprazole', 'Rabeprazole', 'Razo, Rablet', 'ppi', 'Stomach', '20 mg'),
  m('famotidine', 'Famotidine', 'Famocid', 'h2', 'Stomach', '20-40 mg', ['renal']),
  m('antacid', 'Aluminium/Magnesium hydroxide', 'Digene, Gelusil', 'antacid', 'Stomach', '10 ml'),
  m('ondansetron', 'Ondansetron', 'Emeset, Vomikind', 'antiemetic', 'Stomach', '4-8 mg', ['qt', 'serotonergic']),
  m('domperidone', 'Domperidone', 'Domstal', 'antiemetic', 'Stomach', '10 mg', ['qt']),
  m('metoclopramide', 'Metoclopramide', 'Perinorm', 'antiemetic', 'Stomach', '10 mg', ['beers', 'dopamine_block']),

  // Anti-infectives
  m('azithromycin', 'Azithromycin', 'Azithral, Azee', 'macrolide', 'Antibiotic', '500 mg', ['qt']),
  m('clarithromycin', 'Clarithromycin', 'Claribid', 'macrolide', 'Antibiotic', '250-500 mg', ['qt', 'cyp3a4_strong']),
  m('erythromycin', 'Erythromycin', 'Althrocin', 'macrolide', 'Antibiotic', '250-500 mg', ['qt', 'cyp3a4_strong']),
  m('ciprofloxacin', 'Ciprofloxacin', 'Ciplox, Cifran', 'fluoroquinolone', 'Antibiotic', '250-500 mg', ['qt', 'seizure']),
  m('levofloxacin', 'Levofloxacin', 'Levoflox, Glevo', 'fluoroquinolone', 'Antibiotic', '500-750 mg', ['qt', 'renal', 'seizure']),
  m('ofloxacin', 'Ofloxacin', 'Zanocin, Oflox', 'fluoroquinolone', 'Antibiotic', '200-400 mg', ['qt', 'seizure']),
  m('doxycycline', 'Doxycycline', 'Doxy-1, Microdox', 'tetracycline', 'Antibiotic', '100 mg'),
  m('amoxicillin', 'Amoxicillin', 'Mox, Novamox', 'penicillin', 'Antibiotic', '500 mg'),
  m('amox_clav', 'Amoxicillin + Clavulanate', 'Augmentin, Clavam', 'penicillin', 'Antibiotic', '625 mg', ['hepatotoxic']),
  m('cefixime', 'Cefixime', 'Taxim-O, Zifi', 'cephalosporin', 'Antibiotic', '200 mg'),
  m('cefuroxime', 'Cefuroxime', 'Ceftum', 'cephalosporin', 'Antibiotic', '250-500 mg'),
  m('metronidazole', 'Metronidazole', 'Flagyl, Metrogyl', 'nitroimidazole', 'Antibiotic', '400 mg'),
  m('cotrimoxazole', 'Cotrimoxazole', 'Septran, Bactrim', 'sulfonamide', 'Antibiotic', '960 mg', ['hyperkalemia']),
  m('nitrofurantoin', 'Nitrofurantoin', 'Niftran', 'urinary_antiseptic', 'Antibiotic', '100 mg', ['renal']),
  m('fluconazole', 'Fluconazole', 'Forcan, Zocon', 'azole', 'Antifungal', '150 mg', ['qt']),
  m('itraconazole', 'Itraconazole', 'Candiforce', 'azole', 'Antifungal', '100-200 mg', ['cyp3a4_strong', 'hepatotoxic']),
  m('ketoconazole', 'Ketoconazole', 'Nizral', 'azole', 'Antifungal', '200 mg', ['cyp3a4_strong', 'hepatotoxic', 'qt']),
  m('rifampicin', 'Rifampicin', 'R-Cin, Rimactane', 'antitb', 'Tuberculosis', '450-600 mg', ['inducer', 'hepatotoxic']),
  m('isoniazid', 'Isoniazid', 'Isokin', 'antitb', 'Tuberculosis', '300 mg', ['hepatotoxic']),
  m('pyrazinamide', 'Pyrazinamide', 'PZA-Ciba', 'antitb', 'Tuberculosis', '1500 mg', ['hepatotoxic']),
  m('hydroxychloroquine', 'Hydroxychloroquine', 'HCQS', 'antimalarial', 'Antimalarial / immune', '200-400 mg', ['qt']),
  m('artemether', 'Artemether + Lumefantrine', 'Lumerax, Coartem', 'antimalarial', 'Antimalarial / immune', '80/480 mg', ['qt']),
  m('primaquine', 'Primaquine', 'Malirid', 'antimalarial', 'Antimalarial / immune', '15 mg', ['g6pd_risk']),

  // Neurology & psychiatry
  m('phenytoin', 'Phenytoin', 'Eptoin, Dilantin', 'antiepileptic', 'Neurology', '100 mg', ['inducer']),
  m('carbamazepine', 'Carbamazepine', 'Tegretol, Mazetol', 'antiepileptic', 'Neurology', '200 mg', ['inducer', 'hyponatremia', 'cyp3a4_sub']),
  m('valproate', 'Sodium valproate', 'Valparin, Encorate', 'antiepileptic', 'Neurology', '200-500 mg', ['hepatotoxic']),
  m('levetiracetam', 'Levetiracetam', 'Levipil, Keppra', 'antiepileptic', 'Neurology', '500 mg', ['renal']),
  m('sertraline', 'Sertraline', 'Serta, Zoloft', 'ssri', 'Mental health', '50-100 mg', ['serotonergic', 'bleeding', 'hyponatremia']),
  m('fluoxetine', 'Fluoxetine', 'Fludac, Prodep', 'ssri', 'Mental health', '20 mg', ['serotonergic', 'bleeding', 'hyponatremia']),
  m('escitalopram', 'Escitalopram', 'Nexito, Cipralex', 'ssri', 'Mental health', '10 mg', ['serotonergic', 'bleeding', 'qt', 'hyponatremia']),
  m('venlafaxine', 'Venlafaxine', 'Veniz', 'snri', 'Mental health', '75 mg', ['serotonergic', 'bleeding']),
  m('duloxetine', 'Duloxetine', 'Duzela', 'snri', 'Mental health', '30-60 mg', ['serotonergic', 'bleeding', 'hepatotoxic']),
  m('amitriptyline', 'Amitriptyline', 'Tryptomer', 'tca', 'Mental health', '10-25 mg', ['serotonergic', 'anticholinergic', 'qt', 'cns', 'beers']),
  m('alprazolam', 'Alprazolam', 'Alprax, Restyl', 'benzodiazepine', 'Mental health', '0.25-0.5 mg', ['cns', 'beers', 'cyp3a4_sub']),
  m('clonazepam', 'Clonazepam', 'Rivotril, Clonotril', 'benzodiazepine', 'Mental health', '0.25-0.5 mg', ['cns', 'beers']),
  m('diazepam', 'Diazepam', 'Valium, Calmpose', 'benzodiazepine', 'Mental health', '2-5 mg', ['cns', 'beers']),
  m('lorazepam', 'Lorazepam', 'Ativan', 'benzodiazepine', 'Mental health', '1-2 mg', ['cns', 'beers']),
  m('olanzapine', 'Olanzapine', 'Oleanz', 'antipsychotic', 'Mental health', '5-10 mg', ['cns', 'anticholinergic', 'antipsychotic_risk']),
  m('quetiapine', 'Quetiapine', 'Qutipin, Seroquel', 'antipsychotic', 'Mental health', '25-100 mg', ['cns', 'qt', 'cyp3a4_sub', 'antipsychotic_risk']),
  m('haloperidol', 'Haloperidol', 'Serenace', 'antipsychotic', 'Mental health', '1-5 mg', ['qt', 'dopamine_block', 'antipsychotic_risk']),
  m('lithium', 'Lithium carbonate', 'Licab, Lithosun', 'mood_stabilizer', 'Mental health', '300 mg', ['renal']),
  m('zolpidem', 'Zolpidem', 'Stilnoct', 'hypnotic', 'Mental health', '5-10 mg', ['cns', 'beers']),

  // Allergy & respiratory
  m('cetirizine', 'Cetirizine', 'Cetzine, Okacet', 'antihistamine', 'Allergy & respiratory', '10 mg'),
  m('levocetirizine', 'Levocetirizine', 'Levocet, Xyzal', 'antihistamine', 'Allergy & respiratory', '5 mg'),
  m('fexofenadine', 'Fexofenadine', 'Allegra', 'antihistamine', 'Allergy & respiratory', '120-180 mg'),
  m('chlorpheniramine', 'Chlorpheniramine', 'Piriton, Cadistin', 'antihistamine_sedating', 'Allergy & respiratory', '4 mg', ['anticholinergic', 'cns', 'beers']),
  m('montelukast', 'Montelukast', 'Montair, Romilast', 'leukotriene', 'Allergy & respiratory', '10 mg'),
  m('salbutamol', 'Salbutamol', 'Asthalin', 'bronchodilator', 'Allergy & respiratory', '2-4 mg / inhaler', ['hypokalemia']),
  m('theophylline', 'Theophylline', 'Deriphyllin, Theo-Asthalin', 'methylxanthine', 'Allergy & respiratory', '150-300 mg', ['seizure']),
  m('prednisolone', 'Prednisolone', 'Wysolone, Omnacortil', 'corticosteroid', 'Steroid', '5-40 mg'),
  m('dexamethasone', 'Dexamethasone', 'Decdan, Dexona', 'corticosteroid', 'Steroid', '0.5-8 mg'),
  m('methylprednisolone', 'Methylprednisolone', 'Medrol', 'corticosteroid', 'Steroid', '4-16 mg'),

  // Others
  m('allopurinol', 'Allopurinol', 'Zyloric', 'xanthine_oxidase', 'Gout & arthritis', '100-300 mg', ['renal']),
  m('colchicine', 'Colchicine', 'Zycolchin', 'antigout', 'Gout & arthritis', '0.5 mg', ['cyp3a4_sub', 'renal']),
  m('methotrexate', 'Methotrexate', 'Folitrax', 'dmard', 'Gout & arthritis', '7.5-15 mg weekly', ['hepatotoxic', 'renal']),
  m('ferrous_sulfate', 'Ferrous sulfate', 'Livogen, Fefol', 'iron', 'Supplement', '100-200 mg'),
  m('calcium_carbonate', 'Calcium carbonate + Vit D3', 'Shelcal, CCM', 'calcium', 'Supplement', '500 mg'),
  m('potassium_chloride', 'Potassium chloride', 'K-Cl syrup, Kesol', 'potassium', 'Supplement', '10-20 mEq', ['hyperkalemia']),
  m('sildenafil', 'Sildenafil', 'Penegra, Viagra', 'pde5', 'Men\u2019s health', '25-100 mg'),
  m('tadalafil', 'Tadalafil', 'Tadacip, Cialis', 'pde5', 'Men\u2019s health', '10-20 mg'),
  m('tamsulosin', 'Tamsulosin', 'Urimax, Veltam', 'alpha_blocker', 'Men\u2019s health', '0.4 mg'),
  m('finasteride', 'Finasteride', 'Finast', '5ari', 'Men\u2019s health', '5 mg'),
];

export const MED_BY_ID = Object.fromEntries(MEDICINES.map((x) => [x.id, x]));

export function searchMedicines(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MEDICINES.filter(
    (x) => x.name.toLowerCase().includes(q) || x.brand.toLowerCase().includes(q) || x.category.toLowerCase().includes(q),
  ).slice(0, limit);
}
