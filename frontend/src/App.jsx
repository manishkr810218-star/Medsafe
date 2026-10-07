import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Medicines from "./pages/Medicines.jsx";
import Checker from "./pages/Checker.jsx";
import Prescription from "./pages/Prescription.jsx";
import NotFound from "./pages/NotFound.jsx";
import Doctor from "./pages/Doctor.jsx";
import Graph from "./pages/Graph.jsx";
import Reminders from "./pages/Reminders.jsx";
import MasterReport from "./pages/MasterReport.jsx";
import DoctorVerification from "./pages/DoctorVerification.jsx";
import Confirmation from "./pages/Confirmation.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="checker" element={<Checker />} />
        <Route path="prescription" element={<Prescription />} />
        <Route path="doctor" element={<Doctor />} />
        <Route path="graph" element={<Graph />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="report" element={<MasterReport />} />
        <Route path="verification" element={<DoctorVerification />} />
        <Route path="confirmation" element={<Confirmation />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
