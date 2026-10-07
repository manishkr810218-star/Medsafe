import { useLang } from '../i18n/LanguageContext.jsx';
import SeverityBadge from './SeverityBadge.jsx';

export default function AlertCard({ severity, title, message, advice }) {
  const { t, pick } = useLang();
  return (
    <div className={`alert alert-${severity}`}>
      <div className="alert-head">
        <strong>{title}</strong>
        <span className="alert-tags">
          <span className="badge badge-demo">{t.demoTag}</span>
          <SeverityBadge level={severity} />
        </span>
      </div>
      <p>{pick(message)}</p>
      {advice && (
        <p className="muted">
          <strong>{t.checker.advice}:</strong> {pick(advice)}
        </p>
      )}
    </div>
  );
}
