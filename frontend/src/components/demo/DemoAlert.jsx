const TYPE_LABEL = {
  'drug-drug': 'Drug-drug',
  duplicate: 'Duplicate',
  'drug-food': 'Drug-food',
  'drug-disease': 'Drug-disease',
  lab: 'Lab report',
  patient: 'Patient',
};
const SEV_LABEL = { high: 'High', moderate: 'Moderate', low: 'Low' };

export default function DemoAlert({ alert }) {
  return (
    <article className={`alert alert-${alert.sev}`}>
      <div className="alert-head">
        <div>
          <span className="alert-type">{TYPE_LABEL[alert.type]}</span>
          <strong className="alert-title">{alert.title}</strong>
        </div>
        <span className="alert-tags">
          {alert.personal && <span className="badge badge-demo">Personalised</span>}
          <span className={`badge badge-${alert.sev}`}>{SEV_LABEL[alert.sev]}</span>
        </span>
      </div>
      <p className="alert-sub">{alert.subtitle}</p>
      <p>{alert.msg}</p>
      <p className="alert-advice"><b>Advice:</b> {alert.advice}</p>
      {alert.alt && <p className="alert-alt"><b>Safer option:</b> {alert.alt}</p>}
    </article>
  );
}
