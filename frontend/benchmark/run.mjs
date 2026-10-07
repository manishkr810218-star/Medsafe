import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import { createWorker } from "tesseract.js";

const dir = path.dirname(fileURLToPath(import.meta.url));
const generated = path.join(dir, "generated");
await mkdir(generated, { recursive: true });

const cases = [
  {
    id: "clean-print",
    title: "Sample prescription 01",
    lines: ["Demoxetine 10 mg once daily", "Placebol 5 mg at night"],
    drugs: ["Demoxetine", "Placebol"],
    style: "print",
  },
  {
    id: "small-print",
    title: "Sample prescription 02",
    lines: ["Sampleprin 20 mg twice daily", "Testafen 2 mg after food"],
    drugs: ["Sampleprin", "Testafen"],
    style: "small",
  },
  {
    id: "skew-low-contrast",
    title: "Sample prescription 03",
    lines: ["Mockacillin 250 mg morning", "Placebol 5 mg at night"],
    drugs: ["Mockacillin", "Placebol"],
    style: "skew",
  },
  {
    id: "script-like",
    title: "Sample prescription 04",
    lines: ["Demoxetine 10 mg once daily", "Testafen 2 mg after food"],
    drugs: ["Demoxetine", "Testafen"],
    style: "script",
  },
];

const escapeXml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[char],
  );
const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
const compact = (value) => normalize(value).replaceAll(" ", "");

function editDistance(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++)
      next[j] = Math.min(
        next[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    prev.splice(0, prev.length, ...next);
  }
  return prev[b.length];
}

function svgFor(sample) {
  const font =
    sample.style === "script"
      ? "Segoe Print, Comic Sans MS, cursive"
      : "Arial, sans-serif";
  const size = sample.style === "small" ? 25 : 31;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="500"><rect width="100%" height="100%" fill="#fffdf7"/><text x="70" y="70" font-family="Georgia, serif" font-size="30" fill="#3b4f54">${escapeXml(sample.title)}</text><line x1="70" y1="92" x2="970" y2="92" stroke="#c8d0ce"/><text x="70" y="155" font-family="${font}" font-size="${size}" fill="#2e4048">${escapeXml(sample.lines[0])}</text><text x="70" y="222" font-family="${font}" font-size="${size}" fill="#2e4048">${escapeXml(sample.lines[1])}</text><text x="70" y="440" font-family="Georgia, serif" font-size="18" fill="#6c7676">FICTIONAL DEMO · NOT A REAL PRESCRIPTION</text></svg>`;
}

for (const sample of cases) {
  let image = sharp(Buffer.from(svgFor(sample))).png();
  if (sample.style === "skew")
    image = image
      .rotate(3, { background: "#faf9f4" })
      .blur(0.7)
      .linear(0.72, 55);
  await image.toFile(path.join(generated, `${sample.id}.png`));
}

const worker = await createWorker("eng");
const results = [];
try {
  for (const sample of cases) {
    const { data } = await worker.recognize(
      path.join(generated, `${sample.id}.png`),
    );
    const expected = compact(sample.lines.join(" "));
    const actual = compact(
      data.text
        .split("\n")
        .filter((line) =>
          /mg|demoxetine|placebol|sampleprin|testafen|mockacillin/i.test(line),
        )
        .join(" "),
    );
    const found = sample.drugs.filter((drug) =>
      compact(data.text).includes(compact(drug)),
    );
    const result = {
      id: sample.id,
      expected: sample.lines.join(" | "),
      recognized: data.text.trim().replace(/\n+/g, " | "),
      tesseractConfidence: Math.round(data.confidence),
      characterErrorRate: Number(
        (editDistance(expected, actual) / expected.length).toFixed(3),
      ),
      drugNameRecall: `${found.length}/${sample.drugs.length}`,
    };
    results.push(result);
    console.log(
      `${result.id}: CER ${result.characterErrorRate}, drug recall ${result.drugNameRecall}, OCR confidence ${result.tesseractConfidence}%`,
    );
  }
} finally {
  await worker.terminate();
}

const summary = {
  sampleCount: cases.length,
  metricDefinition: "CER is edit distance divided by reference characters on medicine lines after lowercasing and removing spaces/punctuation. Drug-name recall is exact name presence after the same normalization.",
  drugNameRecall: Number(
    (
      results.reduce(
        (count, result) => count + Number(result.drugNameRecall.split("/")[0]),
        0,
      ) / cases.reduce((count, sample) => count + sample.drugs.length, 0)
    ).toFixed(3),
  ),
  meanCharacterErrorRate: Number(
    (
      results.reduce((sum, result) => sum + result.characterErrorRate, 0) /
      results.length
    ).toFixed(3),
  ),
  limitation:
    "Synthetic English images only. Script-like text uses a font, not real handwriting. No patient prescriptions or Indian-language OCR are included.",
  cases: results,
};
await writeFile(
  path.join(dir, "results.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(
  `Overall drug-name recall ${summary.drugNameRecall}, mean CER ${summary.meanCharacterErrorRate}`,
);
