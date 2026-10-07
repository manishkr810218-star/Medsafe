import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { canCreateDraft } from "../src/services/reportValidation.js";
import { runSampleCheck, sampleDrugs, sampleFoods, sampleGraph } from "../src/services/sampleWorkspace.js";

const documents = [
  { kind: "prescription", text: "Demoxetine", reviewed: true },
  { kind: "clinic", text: "Sample clinic note", reviewed: true },
];
const reviewers = [
  { name: "Fictional doctor A", note: "Review doses", simulated: true },
  { name: "Fictional doctor B", note: "Check original", simulated: true },
];

test("draft gate requires corrected documents and distinct handoff entries", () => {
  assert.equal(canCreateDraft({ documents, reviewers, result: { drugDrug: [] } }), true);
  assert.equal(canCreateDraft({ documents: documents.slice(0, 1), reviewers, result: {} }), false);
  assert.equal(canCreateDraft({ documents: [{ ...documents[0], reviewed: false }, documents[1]], reviewers, result: {} }), false);
  assert.equal(canCreateDraft({ documents, reviewers: [reviewers[0], { ...reviewers[1], name: "fictional doctor a" }], result: {} }), false);
  assert.equal(canCreateDraft({ documents, reviewers, result: null }), false);
});

test("sample comparison yields only listed fictional links", () => {
  const medicines = [
    { id: 1, name: "Demoxetine", drugId: "demoxetine" },
    { id: 2, name: "Placebol", drugId: "placebol" },
    { id: 3, name: "Unmatched", drugId: null },
  ];
  const result = runSampleCheck(medicines, [1, 2, 3], ["demo-citrus"]);
  assert.equal(result.drugDrug.length, 1);
  assert.equal(result.drugDrug[0].severity, "high");
  assert.equal(result.drugFood.length, 1);
  assert.deepEqual(result.skipped, ["Unmatched"]);
  assert.match(result.coverage, /missing link does not establish safety/i);
  assert.equal(sampleGraph().edges.length, 15);
});

test("offline catalog and MySQL seed contain the same fictional graph records", () => {
  const seed = readFileSync(new URL("../../backend/db/seed.sql", import.meta.url), "utf8");
  const graph = sampleGraph();
  assert.equal(sampleDrugs.length, 9);
  assert.equal(sampleFoods.length, 6);
  assert.equal(graph.edges.length, 15);
  for (const item of [...sampleDrugs, ...sampleFoods]) assert.ok(seed.includes(`('${item.id}'`), `${item.id} missing from SQL seed`);
  for (const edge of graph.edges) assert.ok(seed.includes(`('${edge.source}', '${edge.target}', '${edge.severity}'`), `${edge.source} + ${edge.target} severity differs from SQL seed`);
});
