import { createWorker } from "tesseract.js";
import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_BYTES = 12 * 1024 * 1024;
const MAX_PAGES = 3;

export async function readPrescription(file, onProgress = () => {}) {
  if (!file || file.size > MAX_BYTES)
    throw new Error("Choose a file smaller than 12 MB.");
  if (!file.type.startsWith("image/") && file.type !== "application/pdf")
    throw new Error("Choose an image or PDF file.");

  const images = [];
  let pdf;
  let worker;
  try {
    if (file.type === "application/pdf") {
      pdf = await pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
      }).promise;
      if (pdf.numPages > MAX_PAGES)
        throw new Error("Choose a PDF with at most 3 pages.");
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport })
          .promise;
        images.push(canvas);
      }
    } else images.push(file);

    worker = await createWorker("eng", 1, {
      logger: (event) => {
        if (event.status === "recognizing text")
          onProgress(Math.round(event.progress * 100));
      },
    });
    const results = [];
    for (const image of images) {
      const { data } = await worker.recognize(image);
      results.push({
        text: data.text.trim(),
        confidence: Math.round(data.confidence || 0),
      });
    }
    return {
      text: results.map((result) => result.text).join("\n\n"),
      confidence: results.length
        ? Math.round(
            results.reduce((total, result) => total + result.confidence, 0) /
              results.length,
          )
        : 0,
      pages: results.length,
    };
  } finally {
    await worker?.terminate();
    await pdf?.destroy();
  }
}

export function findCatalogCandidates(text, drugs) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  return lines.flatMap((line, index) => {
    const normalized = normalize(line);
    return drugs
      .filter((drug) => normalized.includes(normalize(drug.name)))
      .map((drug) => ({ line: index + 1, text: line, drug }));
  });
}
