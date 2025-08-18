import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DevNav from './components/DevNav';

const Onboarding = lazy(() => import('./pages/Onboarding'));
const Quiz       = lazy(() => import('./pages/Quiz'));
const MyQR       = lazy(() => import('./pages/MyQR'));
const Scan       = lazy(() => import('./pages/Scan'));
const Match      = lazy(() => import('./pages/Match'));
const Admin      = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <BrowserRouter>
      {import.meta.env.DEV && <DevNav />}
      <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/myqr" element={<MyQR />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/match" element={<Match />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
