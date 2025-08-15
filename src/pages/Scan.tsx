import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import { useEvent } from '../context/EventContext';
import { QrPayload } from '../schemas/qr';
import { z } from 'zod';

export default function Scan() {
  const { eventCode } = useEvent();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [noCamera, setNoCamera] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<Html5Qrcode>();

  const handleSuccess = (text: string) => {
    try {
      const parsedJson = JSON.parse(text);
      const parsed = QrPayload.safeParse(parsedJson);
      if (!parsed.success) throw new Error('bad');
      const data = parsed.data;
      if (data.event !== eventCode || Date.now() > data.exp) {
        throw new Error('bad');
      }
      navigate('/match', { state: { peerToken: data.token } });
    } catch {
      qrRef.current?.pause(true);
      setError('This QR is expired or not for this event.');
    }
  };

  const handleError = (err: unknown) => {
    const msg = String(err).toLowerCase();
    if (msg.includes('permission') || msg.includes('camera')) {
      setError('');
    }
  };

  const startScanner = async () => {
    if (!scannerRef.current) return;
    const id = 'qr-region';
    scannerRef.current.id = id;
    const html5 = new Html5Qrcode(id);
    qrRef.current = html5;
    try {
      await html5.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleSuccess,
        handleError
      );
      setLoading(false);
    } catch (err) {
      const msg = String(err).toLowerCase();
      if (msg.includes('permission')) {
        setError('Camera permission denied. Enable camera in system settings.');
      } else {
        setError(String(err));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices.length) {
          setNoCamera(true);
          setLoading(false);
          return;
        }
        startScanner();
      })
      .catch(() => {
        setError('Camera permission denied. Enable camera in system settings.');
        setLoading(false);
      });

    return () => {
      const html5 = qrRef.current;
      html5
        ?.stop()
        .then(() => html5.clear())
        .catch(() => {});
    };
  }, [eventCode]);

  useEffect(() => {
    const onVis = () => {
      const qr = qrRef.current;
      if (!qr) return;
      if (document.hidden) qr.pause(true);
      else if (!error) qr.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [error]);

  const handleRetry = () => {
    setError('');
    qrRef.current?.resume().catch(() => {});
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().uuid().safeParse(manualToken.trim());
    if (parsed.success) {
      navigate('/match', { state: { peerToken: parsed.data } });
    } else {
      setError('Invalid token');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {error && <ErrorBanner message={error} />}
      {error === 'This QR is expired or not for this event.' && (
        <button
          onClick={handleRetry}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      )}
      {loading && <Spinner />}
      {!noCamera ? (
        <div ref={scannerRef} />
      ) : (
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-2">
          <input
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            className="border p-2"
            placeholder="Enter token"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
