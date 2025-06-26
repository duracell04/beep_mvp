import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import { useEvent } from '../context/EventContext';

export default function Scan() {
  const { eventCode } = useEvent();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<Html5Qrcode>();

  useEffect(() => {
    if (!scannerRef.current) return;
    const id = 'qr-region';
    scannerRef.current.id = id;
    const html5 = new Html5Qrcode(id);
    qrRef.current = html5;
    html5
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (text) => {
          try {
            const { event, token } = JSON.parse(text);
            if (event !== eventCode) {
              setError('Invalid event code');
              return;
            }
            navigate('/match', { state: { peerToken: token } });
          } catch {
            setError('Invalid QR');
          }
        },
        (err) => {
          if (
            typeof err === 'string' &&
            (err.toLowerCase().includes('permission') ||
              err.toLowerCase().includes('camera'))
          ) {
            setError('');
          }
        }
      )
      .then(() => setLoading(false))
      .catch((err) => {
        if (
          typeof err === 'string' &&
          (err.toLowerCase().includes('permission') ||
            err.toLowerCase().includes('camera'))
        ) {
          setError('');
        } else {
          setError(String(err));
        }
        setLoading(false);
      });

    return () => {
      html5
        .stop()
        .then(() => html5.clear())
        .catch(() => {});
    };
  }, [eventCode, navigate]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {error && <ErrorBanner message={error} />}
      {loading && <Spinner />}
      <div ref={scannerRef} />
    </div>
  );
}
