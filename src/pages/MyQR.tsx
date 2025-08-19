import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { useEvent } from '../context/EventContext';
import { useQuiz } from '../contexts/QuizContext';
import { saveSession } from '../api/sessions';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Copy, Download } from 'lucide-react';

export default function MyQR() {
  const { eventCode } = useEvent();
  const { answers } = useQuiz();
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
    <div className="flex items-center justify-center py-10">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="flex flex-col items-center gap-2">
          <Badge variant="success">Live</Badge>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Show this code to share your answers
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div ref={canvasRef} className="beep-pulse">
            {payload && <QRCodeCanvas value={payload} size={240} includeMargin />}
          </div>
          <p className="text-xs text-slate-500">rotates every 90s</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={copy}
            className="flex items-center gap-1">
            <Copy className="h-4 w-4" /> Copy link
          </Button>
          <Button variant="ghost" size="sm" onClick={download}
            className="flex items-center gap-1">
            <Download className="h-4 w-4" /> Download PNG
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
