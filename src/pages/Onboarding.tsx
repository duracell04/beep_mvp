import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useEvent } from '../context/EventContext';
import BeepLogo from '../components/BeepLogo';

export default function Onboarding() {
  const { setEventCode } = useEvent();
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const schema = z.string().regex(/^\d{4}$/);
  const isValid = schema.safeParse(code).success;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setEventCode(code);
    navigate('/quiz');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <BeepLogo withWordmark className="text-7xl" />
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 text-center text-2xl w-24"
        />
        <button
          type="submit"
          disabled={!isValid}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Join
        </button>
      </form>
    </div>
  );
}
