import React from "react";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function SeverityBadge({ level }) {
  const { t } = useLang();
  return <span className={`badge badge-${level}`}>{t.severity[level]}</span>;
}
