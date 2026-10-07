import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useMedicines } from '../context/MedicineContext.jsx';

export default function Layout() {
  const { t, toggle } = useLang();
  const { error, reload } = useMedicines();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('dic.theme') || 'light');
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('dic.theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealthStatus(data.status))
      .catch(() => setHealthStatus('Offline'));
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const closeMenu = () => setMenuOpen(false);

  const links = [
    ['/', t.nav.dashboard],
    ['/medicines', t.nav.medicines],
    ['/checker', t.nav.checker],
    ['/prescription', t.nav.prescription],
    ['/about', t.nav.about || 'About'],
  ];

  return (
    <div className='app'>
      <header className='topbar'>
        <div className='topbar-inner'>
          <span className='brand'>💊 {t.appName}</span>
          
          <button className='menu-toggle' onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
          
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            {links.map(([to, label]) => (
              <NavLink 
                key={to} 
                to={to} 
                end={to === '/'} 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          
          <div className='topbar-actions' style={{display: 'flex', gap: '8px'}}>
            <button className='theme-toggle btn btn-outline' onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className='btn btn-outline lang-btn' onClick={toggle}>{t.lang}</button>
          </div>
        </div>
      </header>
      
      <div className='demo-banner'>{t.demoBanner} (API Status: {healthStatus})</div>
      
      {error && (
        <div className='error-banner'>
          {t.common.apiError}{' '}
          <button className='btn btn-outline' onClick={reload}>{t.common.retry}</button>
        </div>
      )}
      
      <main className='container'>
        <Outlet />
      </main>
      
      <footer className='footer'>
        <div className='footer-inner'>
          <div className='footer-section'>
            <h4>About Medsafe</h4>
            <p>Your trusted drug interaction checker.</p>
          </div>
          <div className='footer-section'>
            <h4>Quick Links</h4>
            <ul>
              <li><NavLink to="/">Dashboard</NavLink></li>
              <li><NavLink to="/about">About Us</NavLink></li>
            </ul>
          </div>
          <div className='footer-section'>
            <h4>Disclaimer</h4>
            <p>{t.checker?.disclaimer || "Demo data disclaimer."}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
