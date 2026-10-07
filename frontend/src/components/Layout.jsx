import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useMedicines } from "../context/MedicineContext.jsx";

export default function Layout() {
  const { t, setLang, lang } = useLang();
  const { error, reload } = useMedicines();
  const links = [
    ["/", t.nav.dashboard],
    ["/medicines", t.nav.medicines],
    ["/checker", t.nav.checker],
    ["/prescription", t.nav.prescription],
    ["/doctor", t.nav.doctor],
    ["/graph", t.nav.graph],
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">
            <span className="brand-mark">✳</span>
            <span>
              Medsafe<small>INTERACTION CHECKER</small>
            </span>
          </span>
          <nav className="nav">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <label className="language-picker">
            <span aria-hidden="true">◎</span>
            <select
              aria-label="Language"
              value={lang}
              onChange={(event) => setLang(event.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </label>
        </div>
      </header>
      <div className="demo-banner">
        <strong>DEMO ENVIRONMENT</strong>
        <span>{t.demoBanner}</span>
      </div>
      {error && (
        <div className="error-banner">
          {t.common.apiError}{" "}
          <button className="btn btn-outline" onClick={reload}>
            {t.common.retry}
          </button>
        </div>
      )}
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">{t.checker.disclaimer}</footer>
    </div>
  );
}
