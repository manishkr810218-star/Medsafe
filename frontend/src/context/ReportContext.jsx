import React, { createContext, useContext, useState } from "react";

const ReportContext = createContext(null);

// Only non-identifying summaries are kept in this tab. OCR text and patient
// details remain in React memory and disappear when the tab is closed.
export function ReportProvider({ children }) {
  const [draft, setDraft] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem("medsafe.reportSummaries.v1"));
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  });
  const createDraft = (value) => {
    setDraft(value);
    setAcknowledged(false);
    const summary = {
      id: value.id,
      createdAt: value.createdAt,
      documents: value.documents.length,
      medicines: value.medicines.length,
      findings: value.findings.length,
      source: value.source,
    };
    setRecent((items) => {
      const next = [summary, ...items].slice(0, 8);
      sessionStorage.setItem("medsafe.reportSummaries.v1", JSON.stringify(next));
      return next;
    });
  };
  return <ReportContext.Provider value={{ draft, createDraft, acknowledged, setAcknowledged, recent }}>{children}</ReportContext.Provider>;
}

export const useReports = () => useContext(ReportContext);
