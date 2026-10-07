export default function CasePicker({ cases, custom, selectedId, onSelect }) {
  const all = [...cases, custom];
  return (
    <div className="case-grid" role="radiogroup" aria-label="Patient case">
      {all.map((c) => {
        const selected = c.id === selectedId;
        const p = c.patient;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`case-card${selected ? ' selected' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <span className="case-avatar" aria-hidden="true">
              {p.name ? p.name.split(' ').map((w) => w[0]).join('') : '+'}
            </span>
            <span className="case-body">
              <strong>{p.name || c.title}</strong>
              <span className="small muted">
                {p.name ? `${p.age} y, ${p.sex} \u00b7 ${c.prescription.items.length} medicines` : c.tagline}
              </span>
              {p.name && <span className="case-tag">{c.tagline}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
