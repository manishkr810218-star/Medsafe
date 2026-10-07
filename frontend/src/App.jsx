import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Medicines from './pages/Medicines.jsx';
import Checker from './pages/Checker.jsx';
import Prescription from './pages/Prescription.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="checker" element={<Checker />} />
        <Route path="prescription" element={<Prescription />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
