import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function NotFound() {
  const { t } = useLang();
  return (
    <>
      <h1>{t.notFound.title}</h1>
      <Link className="btn" to="/">{t.notFound.back}</Link>
    </>
  );
}
