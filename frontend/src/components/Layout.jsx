import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useMedicines } from '../context/MedicineContext.jsx';

export default function Layout() {
  const { t, toggle } = useLang();
  const { error, reload } = useMedicines();
  const links = [
    ['/', t.nav.dashboard],
    ['/medicines', t.nav.medicines],
    ['/checker', t.nav.checker],
    ['/prescription', t.nav.prescription],
    ['/demo', t.nav.demo],
  ];
  const isDemo = useLocation().pathname.startsWith('/demo');

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">💊 {t.appName}</span>
          <nav className="nav">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {label}
              </NavLink>
            ))}
          </nav>
          <button className="btn btn-outline lang-btn" onClick={toggle}>
            {t.lang}
          </button>
        </div>
      </header>
      <div className="demo-banner">{t.demoBanner}</div>
      {error && !isDemo && (
        <div className="error-banner">
          {t.common.apiError}{' '}
          <button className="btn btn-outline" onClick={reload}>{t.common.retry}</button>
        </div>
      )}
      <main className={`container${isDemo ? ' container-wide' : ''}`}>
        <Outlet />
      </main>
      <footer className="footer">{t.checker.disclaimer}</footer>
    </div>
  );
}
