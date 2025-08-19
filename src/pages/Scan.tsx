import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useEvent } from '../context/EventContext';
import { QrPayload } from '../schemas/qr';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Alert from '../components/ui/Alert';

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
    try {
      qrRef.current?.resume();
    } catch {
      /* ignore */
    }
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
      {error && <Alert variant="error" className="w-full max-w-sm" children={error} />}
      {error === 'This QR is expired or not for this event.' && (
        <Button onClick={handleRetry}>Retry</Button>
      )}
      {loading && <Spinner />}
      {!noCamera ? (
        <div className="relative">
          <div ref={scannerRef} />
          <div className="pointer-events-none absolute inset-0 flex justify-between">
            <div className="m-2 w-8 h-8 border-t-4 border-l-4 border-brand" />
            <div className="m-2 w-8 h-8 border-t-4 border-r-4 border-brand" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between">
            <div className="m-2 w-8 h-8 border-b-4 border-l-4 border-brand" />
            <div className="m-2 w-8 h-8 border-b-4 border-r-4 border-brand" />
          </div>
        </div>
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader>Enter code manually</CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
              <Input
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Enter token"
                label="Token"
              />
              <Button type="submit">Go</Button>
            </form>
          </CardContent>
        </Card>
      )}
      {!noCamera && (
        <button
          onClick={() => setNoCamera(true)}
          className="text-sm underline"
        >
          Enter code manually
        </button>
      )}
      <p className="text-xs text-slate-500">Move closer / Aim at the QR</p>
    </div>
  );
}
