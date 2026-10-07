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
    map: "Relationship map",
    mapHint: "Select a severity to focus the map. Each line is a fictional sample rule, not a clinically validated relationship.",
    all: "All links",
    medicine: "Medicine",
    food: "Food",
  },
  hi: {
    title: "इंटरैक्शन ज्ञान ग्राफ",
    lead: "काल्पनिक दवा सूची और उसके संबंध देखें।",
    drugs: "दवा नोड",
    foods: "खाद्य नोड",
    edges: "इंटरैक्शन लिंक",
    source: "स्रोत",
    empty: "ग्राफ डेटा उपलब्ध नहीं है।",
    map: "संबंध मानचित्र",
    mapHint: "गंभीरता चुनकर मानचित्र देखें। हर रेखा काल्पनिक नमूना नियम है, चिकित्सीय रूप से मान्य संबंध नहीं।",
    all: "सभी लिंक",
    medicine: "दवा",
    food: "भोजन",
  },
  ta: {
    title: "தொடர்பு அறிவு வரைபடம்",
    lead: "கற்பனையான மருந்துப் பட்டியலையும் அதன் தொடர்புகளையும் காண்க.",
    drugs: "மருந்துகள்",
    foods: "உணவுகள்",
    edges: "தொடர்புகள்",
    source: "மூலம்",
    empty: "வரைபடத் தரவு இல்லை.",
    map: "தொடர்பு வரைபடம்",
    mapHint: "தீவிரத்தைத் தேர்ந்து பார்க்கவும். ஒவ்வொரு கோடும் கற்பனை மாதிரி விதி; மருத்துவ ஆதாரம் அல்ல.",
    all: "அனைத்து இணைப்புகள்",
    medicine: "மருந்து",
    food: "உணவு",
  },
};

export default function Graph() {
  const { lang, t, pick } = useLang();
  const { mode } = useMedicines();
  const c = copy[lang];
  const [graph, setGraph] = useState(null);
  const [error, setError] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedEdge, setSelectedEdge] = useState(null);
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
  const edges = graph?.edges || [];
  const visibleEdges = severityFilter === "all" ? edges : edges.filter((edge) => edge.severity === severityFilter);
  const drugNodes = nodes.filter((node) => node.type === "drug");
  const foodNodes = nodes.filter((node) => node.type === "food");
  const drugColumns = drugNodes.length > 6 ? 3 : 2;
  const foodColumns = foodNodes.length > 4 ? 2 : 1;
  const mapHeight = Math.max(485, Math.max(Math.ceil(drugNodes.length / drugColumns), Math.ceil(foodNodes.length / foodColumns)) * 145 + 65);
  const position = new Map([
    ...drugNodes.map((node, index) => [node.id, { x: drugColumns === 3 ? 105 + (index % 3) * 155 : 145 + (index % 2) * 205, y: 85 + Math.floor(index / drugColumns) * 145 }]),
    ...foodNodes.map((node, index) => [node.id, { x: foodColumns === 2 ? 660 + (index % 2) * 155 : 755, y: 85 + Math.floor(index / foodColumns) * 145 }]),
  ]);
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
          <div className="card graph-map-card"><div className="section-head"><div><span className="eyebrow">VISUAL DATA MODEL</span><h2>{c.map}</h2><p className="muted small">{c.mapHint}</p></div></div><div className="graph-filters" role="group" aria-label="Filter relationships by severity">{["all", "high", "moderate", "low"].map((level) => <button type="button" key={level} className={`graph-filter ${severityFilter === level ? "active" : ""}`} onClick={() => { setSeverityFilter(level); setSelectedEdge(null); }}>{level === "all" ? c.all : t.severity[level]} <span>{level === "all" ? edges.length : edges.filter((edge) => edge.severity === level).length}</span></button>)}</div><div className="network-scroll"><svg className="network-map" viewBox={`0 0 900 ${mapHeight}`} role="img" aria-label={`${c.map}: ${visibleEdges.length} ${c.edges}`}><defs><marker id="graph-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="#9eb7b5" /></marker></defs>{visibleEdges.map((edge) => { const a = position.get(edge.source), b = position.get(edge.target); return a && b ? <line key={edge.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`network-link ${edge.severity} ${selectedEdge === edge.id ? "selected" : ""}`} markerEnd="url(#graph-arrow)"><title>{name(edge.source)} + {name(edge.target)} · {t.severity[edge.severity]}</title></line> : null; })}{nodes.map((node) => { const at = position.get(node.id); return at ? <g key={node.id} className={`network-node ${node.type}`} transform={`translate(${at.x} ${at.y})`}><circle r="41" /><text textAnchor="middle" y="-4" className="network-glyph">{node.type === "food" ? "◈" : "✳"}</text><text textAnchor="middle" y="17" className="network-label">{name(node.id).length > 17 ? `${name(node.id).slice(0, 15)}…` : name(node.id)}</text><title>{name(node.id)} · {node.type === "food" ? c.food : c.medicine}</title></g> : null; })}</svg></div><div className="network-legend"><span><i className="node-key drug" />{c.medicine}</span><span><i className="node-key food" />{c.food}</span><span><i className="line-key high" />{t.severity.high}</span><span><i className="line-key moderate" />{t.severity.moderate}</span><span><i className="line-key low" />{t.severity.low}</span></div></div>
          <div className="graph-list">
            {visibleEdges.map((edge) => (
              <button type="button" className={`card graph-edge graph-edge-button ${selectedEdge === edge.id ? "selected" : ""}`} key={edge.id} onClick={() => setSelectedEdge(edge.id)}>
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
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
