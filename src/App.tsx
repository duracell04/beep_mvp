// App.tsx – root app component
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Onboarding, Quiz, Match, Admin } from './pages';
import MyQR from './pages/MyQR';
import DevNav from './components/DevNav';

export default function App() {
  return (
    <BrowserRouter>
      {import.meta.env.DEV && <DevNav />}
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/myqr" element={<MyQR />} />
        <Route path="/match" element={<Match />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
