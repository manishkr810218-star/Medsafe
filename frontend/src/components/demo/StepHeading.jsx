export default function StepHeading({ id, n, title, hint }) {
  return (
    <div className="step-head">
      <span className="step-num" aria-hidden="true">{n}</span>
      <div>
        <h2 id={id}>
          <span className="sr-only">Step {n}: </span>
          {title}
        </h2>
        {hint && <p className="muted small">{hint}</p>}
      </div>
    </div>
  );
}
