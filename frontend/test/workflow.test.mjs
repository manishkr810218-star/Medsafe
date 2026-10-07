import assert from "node:assert/strict";
import test from "node:test";
import { canCreateDraft } from "../src/services/reportValidation.js";
import { runSampleCheck, sampleGraph } from "../src/services/sampleWorkspace.js";

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
  assert.equal(sampleGraph().edges.length, 6);
});
