import React from "react";
import { useEffect, useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import { api } from "../services/api.js";
import SeverityBadge from "../components/SeverityBadge.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";
import { sampleGraph } from "../services/sampleWorkspace.js";

const copy = {
  en: {
    title: "Interaction knowledge graph",
    lead: "Explore the fictional catalog and its typed relationship edges.",
    drugs: "Medicine nodes",
    foods: "Food nodes",
    edges: "Interaction edges",
    source: "Provenance",
    empty: "No graph data available.",
  },
  hi: {
    title: "इंटरैक्शन ज्ञान ग्राफ",
    lead: "काल्पनिक दवा सूची और उसके संबंध देखें।",
    drugs: "दवा नोड",
    foods: "खाद्य नोड",
    edges: "इंटरैक्शन लिंक",
    source: "स्रोत",
    empty: "ग्राफ डेटा उपलब्ध नहीं है।",
  },
  ta: {
    title: "தொடர்பு அறிவு வரைபடம்",
    lead: "கற்பனையான மருந்துப் பட்டியலையும் அதன் தொடர்புகளையும் காண்க.",
    drugs: "மருந்துகள்",
    foods: "உணவுகள்",
    edges: "தொடர்புகள்",
    source: "மூலம்",
    empty: "வரைபடத் தரவு இல்லை.",
  },
};

export default function Graph() {
  const { lang, t, pick } = useLang();
  const { mode } = useMedicines();
  const c = copy[lang];
  const [graph, setGraph] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (mode === "loading") return;
    if (mode === "sample") {
      setGraph(sampleGraph());
      setError(false);
      return;
    }
    api("/graph")
      .then(setGraph)
      .catch(() => setError(true));
  }, [mode]);
  const nodes = graph?.nodes || [];
  const name = (id) => {
    const node = nodes.find((item) => item.id === id);
    return typeof node?.name === "string" ? node.name : pick(node?.name) || id;
  };
  return (
    <section className="page-flow">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DATA MODEL / DEMO</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
        <span className="icon-tile">⌘</span>
      </div>
      {error ? (
        <p className="error">{t.common.apiError}</p>
      ) : !graph ? (
        <p>{t.common.loading}</p>
      ) : (
        <>
          <div className="stats graph-stats">
            <div className="card stat">
              <span className="stat-num">
                {nodes.filter((n) => n.type === "drug").length}
              </span>
              <span>{c.drugs}</span>
            </div>
            <div className="card stat">
              <span className="stat-num">
                {nodes.filter((n) => n.type === "food").length}
              </span>
              <span>{c.foods}</span>
            </div>
            <div className="card stat">
              <span className="stat-num">{graph.edges.length}</span>
              <span>{c.edges}</span>
            </div>
          </div>
          <p className="notice">{graph.coverage}</p>
          <div className="graph-list">
            {graph.edges.map((edge) => (
              <div className="card graph-edge" key={edge.id}>
                <span className="graph-nodes">
                  <strong>{name(edge.source)}</strong>
                  <span className="connector">→</span>
                  <strong>{name(edge.target)}</strong>
                </span>
                <span className="edge-detail">
                  <SeverityBadge level={edge.severity} />
                  <small>
                    {edge.type} · {c.source}: {edge.provenance}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
