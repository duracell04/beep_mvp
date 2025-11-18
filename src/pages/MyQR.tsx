import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { useQuiz } from '../contexts/QuizContext';
import { saveSession } from '../api/sessions';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Copy, Download } from 'lucide-react';

export default function MyQR() {
  const { eventCode } = useEvent();
  const { answers } = useQuiz();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [payload, setPayload] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

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
    navigator.clipboard?.writeText(`${window.location.origin}/scan?token=${token}`).catch(() => {});
  };

  const download = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'beep-qr.png';
    link.click();
  };

  return (
    <div className="space-y-6 py-6">
      <section className="rounded-[32px] bg-gradient-to-r from-emerald-500 via-emerald-500 to-lime-400 p-6 text-center text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.6em] text-white/80">Active mode</p>
        <h1 className="mt-2 text-3xl font-semibold">Scan &amp; be scanned</h1>
        <p className="mt-3 text-base text-white/90">Break the Ice - One beep at a time.</p>
      </section>

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex flex-col items-center gap-4 border-b border-slate-100 p-6 text-center">
          <Badge variant="success" className="uppercase tracking-[0.4em]">
            Live badge
          </Badge>
          <p className="text-sm text-slate-500">
            Your dynamic QR proves the employee is authenticated and rotating every 90 seconds.
          </p>
          <div
            ref={canvasRef}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-inner"
          >
            {payload && <QRCodeCanvas value={payload} size={240} includeMargin />}
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Refreshes automatically</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={copy}
              className="flex items-center gap-1 rounded-full px-4"
            >
              <Copy className="h-4 w-4" /> Copy link
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={download}
              className="flex items-center gap-1 rounded-full px-4 text-slate-600"
            >
              <Download className="h-4 w-4" /> Download PNG
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 bg-slate-900 p-6 text-center text-white">
          <p className="text-xs uppercase tracking-[0.6em] text-white/70">Ready for action</p>
          <p className="text-lg font-semibold text-white/90">
            Show this screen or tap to scan someone in
          </p>
          <button
            type="button"
            onClick={() => navigate('/scan')}
            className="beep-sonar w-full max-w-sm rounded-full bg-white px-8 py-5 text-2xl font-semibold uppercase tracking-[0.4em] text-slate-900 shadow-xl transition hover:-translate-y-0.5"
          >
            Beep someone
          </button>
          <p className="text-sm text-white/80">
            Opens the camera instantly to keep the momentum of the moment.
          </p>
        </div>
      </div>
    </div>
  );
}
