import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const ReminderContext = createContext(null);
const KEY = "medsafe.reminders.v1";
const dateKey = (date = new Date()) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");

const sampleSchedule = [
  { id: "sample-morning", medicine: "Demoxetine", time: "08:00", instruction: "After breakfast", enabled: false, sample: true, takenOn: "", lastFired: "" },
  { id: "sample-noon", medicine: "Placebol", time: "13:00", instruction: "After lunch", enabled: false, sample: true, takenOn: "", lastFired: "" },
  { id: "sample-evening", medicine: "Sampleprin", time: "20:00", instruction: "With water", enabled: false, sample: true, takenOn: "", lastFired: "" },
];

function load() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value.filter((item) => item && typeof item.id === "string" && typeof item.time === "string") : sampleSchedule;
  } catch { return sampleSchedule; }
}

export function playReminderBell() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;
  const context = new AudioContext();
  const start = context.currentTime;
  [0, 0.22, 0.44].forEach((offset) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = offset === 0.44 ? 880 : 660;
    gain.gain.setValueAtTime(0.001, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.18, start + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + offset + 0.18);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + 0.2);
  });
  setTimeout(() => context.close(), 1200);
  return true;
}

export function ReminderProvider({ children }) {
  const [reminders, setReminders] = useState(load);
  const [ringing, setRinging] = useState(null);
  const remindersRef = useRef(reminders);
  useEffect(() => {
    remindersRef.current = reminders;
    localStorage.setItem(KEY, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const today = dateKey(now);
      const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const due = remindersRef.current.find((item) => item.enabled && item.time === clock && item.takenOn !== today && item.lastFired !== today);
      if (!due) return;
      setReminders((items) => items.map((item) => item.id === due.id ? { ...item, lastFired: today } : item));
      setRinging(due);
      try { playReminderBell(); } catch { /* Audio may be blocked until a user gesture. */ }
      if ("Notification" in window && Notification.permission === "granted") {
        try { new Notification("Medsafe medicine reminder", { body: `${due.medicine} · ${due.instruction || "Check your schedule"}` }); }
        catch { /* Some mobile browsers do not support the constructor. */ }
      }
    };
    tick();
    const timer = setInterval(tick, 10000);
    return () => clearInterval(timer);
  }, []);

  const addReminder = (input) => {
    const medicine = input.medicine.trim();
    if (!medicine || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) return false;
    setReminders((items) => [...items, {
      id: crypto.randomUUID(), medicine, time: input.time,
      instruction: input.instruction.trim(), enabled: true, sample: false,
      takenOn: "", lastFired: "",
    }]);
    return true;
  };
  const updateReminder = (id, change) => setReminders((items) => items.map((item) => item.id === id ? { ...item, ...change } : item));
  const removeReminder = (id) => setReminders((items) => items.filter((item) => item.id !== id));
  const markTaken = (id) => {
    updateReminder(id, { takenOn: dateKey() });
    setRinging(null);
  };
  const snooze = () => setRinging(null);
  return <ReminderContext.Provider value={{ reminders, ringing, addReminder, updateReminder, removeReminder, markTaken, snooze, today: dateKey() }}>{children}</ReminderContext.Provider>;
}

export const useReminders = () => useContext(ReminderContext);
