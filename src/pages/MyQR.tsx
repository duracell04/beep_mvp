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

  useEffect(() => {
    const generate = async () => {
      const newToken = uuidv4();
      setToken(newToken);
      await saveSession(newToken, eventCode, answers);
    };
    generate();
    const id = setInterval(() => setToken(uuidv4()), 90_000);
    return () => clearInterval(id);
  }, [eventCode, answers]);

  const payload = JSON.stringify({ event: eventCode, token, ts: Date.now() });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <QRCode value={payload} />
    </div>
  );
}
