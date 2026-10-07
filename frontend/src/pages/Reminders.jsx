import React, { useMemo, useState } from "react";
import { useMedicines } from "../context/MedicineContext.jsx";
import { playReminderBell, useReminders } from "../context/ReminderContext.jsx";
import { useLang } from "../i18n/LanguageContext.jsx";

const words = {
  en: { title: "Medicine reminders", lead: "A simple daily schedule with a bell while Medsafe is open.", add: "Add reminder", medicine: "Medicine", time: "Time", instruction: "How to take it (optional)", save: "Save reminder", today: "Today", taken: "Taken today", mark: "Mark taken", active: "Bell on", paused: "Bell off", remove: "Remove", test: "Test bell", permission: "Enable desktop notifications", browser: "The bell works while this browser tab is open. Notifications need permission and may vary by device. Do not rely on this prototype as your only medication alarm.", sample: "Sample schedule · switch on a reminder to test it", permissionDenied: "Notifications are not available or were declined. In-page bell remains available." },
  hi: { title: "दवा की याद दिलाने वाली सूची", lead: "Medsafe खुला रहने पर दैनिक घंटी के साथ आसान समय-सारणी।", add: "रिमाइंडर जोड़ें", medicine: "दवा", time: "समय", instruction: "लेने का तरीका (वैकल्पिक)", save: "सहेजें", today: "आज", taken: "आज ले ली", mark: "ली गई चिह्नित करें", active: "घंटी चालू", paused: "घंटी बंद", remove: "हटाएँ", test: "घंटी सुनें", permission: "डेस्कटॉप सूचना चालू करें", browser: "घंटी केवल ब्राउज़र टैब खुले रहने पर काम करती है। सूचना के लिए अनुमति चाहिए। इस प्रोटोटाइप को दवा का एकमात्र अलार्म न मानें।", sample: "नमूना समय-सारणी · जाँचने के लिए रिमाइंडर चालू करें", permissionDenied: "सूचनाएँ उपलब्ध नहीं हैं या अनुमति नहीं मिली। पेज की घंटी फिर भी उपलब्ध है।" },
  ta: { title: "மருந்து நினைவூட்டல்கள்", lead: "Medsafe திறந்திருக்கும் போது தினசரி மணி ஒலிக்கும் அட்டவணை.", add: "நினைவூட்டலைச் சேர்", medicine: "மருந்து", time: "நேரம்", instruction: "எப்படி எடுத்துக் கொள்ள வேண்டும் (விருப்பம்)", save: "சேமி", today: "இன்று", taken: "இன்று எடுத்தது", mark: "எடுத்ததாகக் குறி", active: "மணி இயக்கம்", paused: "மணி நிறுத்தம்", remove: "நீக்கு", test: "மணியைச் சோதி", permission: "கணினி அறிவிப்புகளை இயக்கு", browser: "உலாவி திறந்திருக்கும் போது மட்டுமே மணி ஒலிக்கும். அறிவிப்புக்கு அனுமதி தேவை. இந்த மாதிரியை ஒரே மருந்து அலாரமாக நம்ப வேண்டாம்.", sample: "மாதிரி அட்டவணை · சோதிக்க நினைவூட்டலை இயக்கவும்", permissionDenied: "அறிவிப்புகள் கிடைக்கவில்லை அல்லது அனுமதி மறுக்கப்பட்டது. பக்க மணி இன்னும் கிடைக்கும்." },
};

export default function Reminders() {
  const { lang } = useLang();
  const c = words[lang];
  const { medicines } = useMedicines();
  const { reminders, ringing, addReminder, updateReminder, removeReminder, markTaken, snooze, today } = useReminders();
  const [form, setForm] = useState({ medicine: "", time: "08:00", instruction: "" });
  const [notice, setNotice] = useState("");
  const sorted = useMemo(() => [...reminders].sort((a, b) => a.time.localeCompare(b.time)), [reminders]);

  const submit = (event) => {
    event.preventDefault();
    if (addReminder(form)) setForm({ medicine: "", time: "08:00", instruction: "" });
  };
  const enableNotifications = async () => {
    if (!("Notification" in window) || !window.isSecureContext) {
      setNotice(c.permissionDenied);
      return;
    }
    const result = await Notification.requestPermission();
    setNotice(result === "granted" ? "Notifications enabled." : c.permissionDenied);
  };

  return <section className="page-flow reminders-page">
    <div className="page-heading"><div><span className="eyebrow">DAILY CARE</span><h1>{c.title}</h1><p>{c.lead}</p></div><span className="icon-tile">◷</span></div>
    {ringing && <div className="reminder-alarm" role="alert"><div><strong>🔔 {ringing.medicine}</strong><p>{ringing.instruction || ringing.time}</p></div><div className="actions"><button className="btn btn-light" onClick={() => markTaken(ringing.id)}>{c.mark}</button><button className="btn btn-ghost" onClick={snooze}>Dismiss</button></div></div>}
    <div className="reminder-tools"><button className="btn btn-outline" onClick={() => { try { playReminderBell(); } catch { setNotice(c.permissionDenied); } }}>{c.test}</button><button className="btn btn-outline" onClick={enableNotifications}>{c.permission}</button></div>
    {notice && <p className="notice" role="status">{notice}</p>}
    <p className="notice">{c.browser}</p>
    <div className="reminder-grid">
      <div className="card"><div className="section-head"><h2>{c.today}</h2><span className="count-pill">{sorted.length}</span></div><p className="muted small">{c.sample}</p>
        <div className="timeline">{sorted.map((item) => <div className="timeline-item" key={item.id}>
          <div className="timeline-time">{item.time}</div><div className="timeline-body"><strong>{item.medicine}</strong><span>{item.instruction}</span><small>{item.takenOn === today ? c.taken : item.enabled ? c.active : c.paused}{item.sample ? " · SAMPLE" : ""}</small></div>
          <div className="timeline-actions"><label className="switch-label"><input type="checkbox" checked={item.enabled} onChange={(event) => updateReminder(item.id, { enabled: event.target.checked })} aria-label={`${item.medicine} ${c.active}`} /><span>{item.enabled ? c.active : c.paused}</span></label><button className="text-link" disabled={item.takenOn === today} onClick={() => markTaken(item.id)}>{c.mark}</button><button className="text-link danger-link" onClick={() => removeReminder(item.id)}>{c.remove}</button></div>
        </div>)}</div>
      </div>
      <form className="card reminder-form" onSubmit={submit}><h2>{c.add}</h2><label>{c.medicine}<input list="reminder-medicines" required maxLength={100} value={form.medicine} onChange={(event) => setForm({ ...form, medicine: event.target.value })} placeholder="e.g. Demoxetine" /></label><datalist id="reminder-medicines">{medicines.map((medicine) => <option key={medicine.id} value={medicine.name} />)}</datalist><label>{c.time}<input type="time" required value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} /></label><label>{c.instruction}<input maxLength={120} value={form.instruction} onChange={(event) => setForm({ ...form, instruction: event.target.value })} placeholder="e.g. After food" /></label><button className="btn" type="submit">{c.save}</button></form>
    </div>
  </section>;
}
