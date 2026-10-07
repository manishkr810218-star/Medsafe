// Offline presentation data mirrors backend/db/seed.sql. These names and rules
// are fictional and must never be used to make care decisions.
export const sampleDrugs = [
  "Demoxetine", "Placebol", "Sampleprin", "Mockacillin", "Testafen",
  "Trialadine", "Simulor", "Mockifen", "Fictoval",
].map((name) => ({ id: name.toLowerCase(), name, isDemo: true }));

export const sampleFoods = [
  { id: "demo-citrus", name: { en: "Demo Citrus Fruit", hi: "डेमो खट्टा फल", ta: "மாதிரி சிட்ரஸ் பழம்" } },
  { id: "demo-dairy", name: { en: "Demo Dairy Product", hi: "डेमो डेयरी उत्पाद", ta: "மாதிரி பால் பொருள்" } },
  { id: "demo-greens", name: { en: "Demo Leafy Greens", hi: "डेमो हरी पत्तेदार सब्ज़ी", ta: "மாதிரி கீரைகள்" } },
  { id: "demo-tea", name: { en: "Demo Herbal Tea", hi: "डेमो हर्बल चाय", ta: "மாதிரி மூலிகை தேநீர்" } },
  { id: "demo-grain", name: { en: "Demo Grain Meal", hi: "डेमो अनाज भोजन", ta: "மாதிரி தானிய உணவு" } },
  { id: "demo-berries", name: { en: "Demo Berry Bowl", hi: "डेमो बेरी कटोरा", ta: "மாதிரி பெர்ரி உணவு" } },
].map((food) => ({ ...food, isDemo: true }));

const drugPairs = [
  ["demoxetine", "placebol", "high"],
  ["sampleprin", "testafen", "moderate"],
  ["mockacillin", "placebol", "low"],
  ["placebol", "trialadine", "moderate"],
  ["demoxetine", "simulor", "low"],
  ["mockifen", "trialadine", "high"],
  ["fictoval", "simulor", "moderate"],
  ["mockifen", "testafen", "low"],
];
const foodPairs = [
  ["demoxetine", "demo-citrus", "moderate"],
  ["mockacillin", "demo-dairy", "low"],
  ["testafen", "demo-greens", "high"],
  ["trialadine", "demo-tea", "high"],
  ["simulor", "demo-grain", "low"],
  ["fictoval", "demo-berries", "moderate"],
  ["mockifen", "demo-dairy", "moderate"],
];
const findDrug = (id) => sampleDrugs.find((drug) => drug.id === id);
const findFood = (id) => sampleFoods.find((food) => food.id === id);
export const sampleCoverage = "Fictional sample catalog only. A missing link does not establish safety.";

export function sampleGraph() {
  return {
    nodes: [
      ...sampleDrugs.map((drug) => ({ ...drug, type: "drug", standardCode: null })),
      ...sampleFoods.map((food) => ({ ...food, type: "food" })),
    ],
    edges: [
      ...drugPairs.map(([source, target, severity], index) => ({ id: `dd-${index}`, type: "drug-drug", source, target, severity, provenance: "Fictional sample rule", isDemo: true })),
      ...foodPairs.map(([source, target, severity], index) => ({ id: `df-${index}`, type: "drug-food", source, target, severity, provenance: "Fictional sample rule", isDemo: true })),
    ],
    coverage: sampleCoverage,
  };
}

const STORAGE_KEY = "medsafe.sampleMedicines.v1";
export function loadSampleMedicines() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(value) ? value.filter((item) => item && typeof item.name === "string") : [];
  } catch { return []; }
}
export function saveSampleMedicines(medicines) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
}
export function addSampleMedicine(medicines, input) {
  const name = input.name.trim().replace(/\s+/g, " ");
  if (!name) return medicines;
  if (medicines.some((item) => item.name.toLowerCase() === name.toLowerCase())) return medicines;
  const drug = sampleDrugs.find((item) => item.name.toLowerCase() === name.toLowerCase());
  return [...medicines, {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: drug?.name || name,
    drugId: drug?.id || null,
    dose: input.dose || "",
    frequency: input.frequency || "",
  }];
}

export function runSampleCheck(medicines, medicineIds, foodIds) {
  const selected = medicines.filter((medicine) => medicineIds.includes(medicine.id));
  const drugIds = new Set(selected.map((medicine) => medicine.drugId).filter(Boolean));
  const foodSet = new Set(foodIds);
  const message = (severity) => ({
    en: `Fictional ${severity}-severity sample relationship. This is not clinical evidence.`,
    hi: `यह ${severity} स्तर का काल्पनिक नमूना संबंध है। यह चिकित्सीय प्रमाण नहीं है।`,
    ta: `இது ${severity} நிலை கற்பனை மாதிரி தொடர்பு. மருத்துவ ஆதாரம் அல்ல.`,
  });
  const advice = {
    en: "Ask a qualified clinician to check a validated source before changing treatment.",
    hi: "इलाज बदलने से पहले योग्य चिकित्सक से मान्य स्रोत जाँचने को कहें।",
    ta: "சிகிச்சையை மாற்றும் முன் மருத்துவரிடம் சரிபார்க்கப்பட்ட ஆதாரத்தைப் பார்க்கவும்.",
  };
  return {
    coverage: sampleCoverage,
    checkedAt: new Date().toISOString(),
    skipped: selected.filter((medicine) => !medicine.drugId).map((medicine) => medicine.name),
    drugDrug: drugPairs.filter(([a, b]) => drugIds.has(a) && drugIds.has(b)).map(([a, b, severity]) => ({
      severity, drugNames: [findDrug(a).name, findDrug(b).name], message: message(severity), advice, isDemo: true,
    })),
    drugFood: foodPairs.filter(([a, b]) => drugIds.has(a) && foodSet.has(b)).map(([a, b, severity]) => ({
      severity, drugName: findDrug(a).name, foodName: findFood(b).name, message: message(severity), advice, isDemo: true,
    })),
  };
}
