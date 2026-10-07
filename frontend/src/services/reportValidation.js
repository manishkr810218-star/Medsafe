// A draft may be prepared after document correction, a fresh comparison and
// two distinct simulated handoff notes. This is NOT clinical approval.
export function canCreateDraft({ documents, result, reviewers }) {
  if (!result || !Array.isArray(documents) || !Array.isArray(reviewers) || reviewers.length !== 2) return false;
  if (!documents.length || documents.some((document) => !document.reviewed || !document.text?.trim())) return false;
  if (!["prescription", "clinic"].every((kind) => documents.some((document) => document.kind === kind))) return false;
  if (!reviewers.every((reviewer) => reviewer.simulated && reviewer.name?.trim() && reviewer.note?.trim())) return false;
  return reviewers[0].name.trim().toLowerCase() !== reviewers[1].name.trim().toLowerCase();
}
