import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useMedicines } from '../context/MedicineContext.jsx';
import AlertCard from '../components/AlertCard.jsx';

export default function Dashboard() {
  const { t, lang } = useLang();
  const { medicines, lastCheck } = useMedicines();
  const d = t.dashboard;
  const alertCount = lastCheck ? lastCheck.drugDrug.length + lastCheck.drugFood.length : 0;
  const when = lastCheck
    ? new Date(lastCheck.checkedAt).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN')
    : d.never;

  return (
    <>
      <div className='hero'>
        <h1>{d.welcome}</h1>
        <p className='muted'>{d.subtitle}</p>
        <div className='actions'>
          <Link className='btn' to='/medicines'>{d.addMed}</Link>
          <Link className='btn' to='/checker'>{d.runCheck}</Link>
          <Link className='btn btn-outline' to='/prescription'>{d.upload}</Link>
        </div>
      </div>
      
      <div className='features'>
        <div className='feature-card'>
          <span className='feature-icon'>🔍</span>
          <h3>Drug Verification</h3>
          <p>Check drug ingredients and combinations.</p>
        </div>
        <div className='feature-card'>
          <span className='feature-icon'>⚠️</span>
          <h3>Interaction Checks</h3>
          <p>Get alerted for drug-drug and drug-food interactions.</p>
        </div>
        <div className='feature-card'>
          <span className='feature-icon'>🌐</span>
          <h3>Bilingual Support</h3>
          <p>English and Hindi translations available.</p>
        </div>
        <div className='feature-card'>
          <span className='feature-icon'>📋</span>
          <h3>Prescription Upload</h3>
          <p>Easily manage and upload prescription documents.</p>
        </div>
      </div>

      <div className='stats'>
        <div className='card stat'><span className='stat-num'>{medicines.length}</span><span>{d.medicines}</span></div>
        <div className='card stat'><span className='stat-num'>{lastCheck ? alertCount : '–'}</span><span>{d.alerts}</span></div>
        <div className='card stat'><span className='stat-text'>{when}</span><span>{d.lastCheck}</span></div>
      </div>
      
      <h2>{d.recent}</h2>
      {!lastCheck ? (
        <p className='muted'>{d.noRecent}</p>
      ) : alertCount === 0 ? (
        <p>{t.checker.none}</p>
      ) : (
        <>
          {lastCheck.drugDrug.map((i, n) => (
            <AlertCard key={`dd${n}`} severity={i.severity} title={i.drugNames.join(' + ')} message={i.message} advice={i.advice} />
          ))}
          {lastCheck.drugFood.map((i, n) => (
            <AlertCard key={`df${n}`} severity={i.severity} title={`${i.drugName} + ${i.foodName[lang]}`} message={i.message} advice={i.advice} />
          ))}
        </>
      )}
    </>
  );
}
