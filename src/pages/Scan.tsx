import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useEvent } from '../context/EventContext';
import { QrPayload } from '../schemas/qr';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
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
    <div className="space-y-4 py-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Camera mode</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">BEEP SOMEONE</h1>
        <p className="mt-2 text-sm text-slate-500">
          Point at their badge and we instantly script the follow-up conversation.
        </p>
      </section>

      <div className="flex flex-col items-center gap-4">
        {error && <Alert variant="error" className="w-full max-w-md" children={error} />}
        {error === 'This QR is expired or not for this event.' && (
          <Button onClick={handleRetry}>Retry</Button>
        )}
        {loading && <Spinner />}
        {!noCamera ? (
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-lg">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Camera is live</p>
            <p className="mt-2 text-sm text-slate-500">Line up the QR until the corners glow.</p>
            <div className="relative mt-4 rounded-3xl border border-slate-900/10 bg-slate-900/80 p-3">
              <div ref={scannerRef} className="aspect-square rounded-2xl bg-black" />
              <div className="pointer-events-none absolute inset-0 flex justify-between">
                <div className="m-4 h-10 w-10 border-t-4 border-l-4 border-emerald-400" />
                <div className="m-4 h-10 w-10 border-t-4 border-r-4 border-emerald-400" />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between">
                <div className="m-4 h-10 w-10 border-b-4 border-l-4 border-emerald-400" />
                <div className="m-4 h-10 w-10 border-b-4 border-r-4 border-emerald-400" />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">Move closer - keep both badges inside the frame.</p>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg">
            <p className="text-lg font-semibold text-slate-900">Enter code manually</p>
            <form onSubmit={handleManualSubmit} className="mt-4 flex flex-col gap-4">
              <Input
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste token"
                label="Token"
              />
              <Button type="submit" className="rounded-full">
                Go
              </Button>
            </form>
          </div>
        )}
        {!noCamera && (
          <button
            onClick={() => setNoCamera(true)}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500"
          >
            Prefer to type the code?
          </button>
        )}
      </div>
    </div>
  );
}
