import React, { useEffect, useState } from 'react';
import { QRCode } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { useEvent } from '../context/EventContext';
import { useQuiz } from '../contexts/QuizContext';
import { saveSession } from '../api/sessions';

export default function MyQR() {
  const { eventCode } = useEvent();
  const { answers } = useQuiz();
  const [token, setToken] = useState('');
  const [payload, setPayload] = useState('');

  useEffect(() => {
    const generate = async () => {
      const newToken = uuidv4();
      const exp = Date.now() + 120_000;
      setToken(newToken);
      setPayload(
        JSON.stringify({ event: eventCode, token: newToken, ts: Date.now(), exp })
      );
      await saveSession(newToken, eventCode, answers);
    };
    generate();
    const id = setInterval(generate, 90_000);
    return () => clearInterval(id);
  }, [eventCode, answers]);

  const copy = () => {
    navigator.clipboard?.writeText(token).catch(() => {});
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      {payload && <QRCode value={payload} />}
      <button onClick={copy} className="text-xs underline">
        copy
      </button>
      <p className="text-xs text-gray-500">rotates every 90s</p>
    </div>
  );
}
