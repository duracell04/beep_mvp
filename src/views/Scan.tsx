'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Loader2 } from 'lucide-react';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseQrPayload } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';

const Scan = () => {
  const { eventCode } = useEvent();
  const { answers } = useQuiz();
  const router = useRouter();
  const { toast } = useToast();

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eventCode || !answers) {
      router.replace('/onboarding');
      return;
    }

    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => undefined);
      }
    };
  }, [eventCode, answers, router, scanning]);

  const handleScanSuccess = async (decoded: string) => {
    setLoading(true);
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
      const payload = parseQrPayload(decoded);
      if (!payload?.t || payload.e !== eventCode) {
        toast({
          title: 'Wrong event',
          description: 'That badge belongs to another event.',
          variant: 'destructive',
        });
        setScanning(false);
        setLoading(false);
        return;
      }
      setLoading(false);
      setScanning(false);
      router.push(`/match?peer=${encodeURIComponent(payload.t)}`);
    } catch (error) {
      console.error('Scan error', error);
      toast({
        title: 'Scan failed',
        description: 'Please try again or enter the code manually.',
        variant: 'destructive',
      });
      setLoading(false);
      setScanning(false);
    }
  };

  const startScanner = async () => {
    if (!readerContainerRef.current) return;
    try {
      setScanning(true);
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => undefined,
      );
    } catch (error) {
      console.error('Camera error', error);
      toast({
        title: 'Camera error',
        description: 'Grant camera permissions or try manual entry.',
        variant: 'destructive',
      });
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (!scannerRef.current || !scanning) return;
    scannerRef.current
      .stop()
      .then(() => scannerRef.current?.clear())
      .finally(() => setScanning(false));
  };

  const handleManualSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!manualToken.trim()) {
      toast({
        title: 'Token required',
        description: 'Paste the token under the QR code.',
      });
      return;
    }
    router.push(`/match?peer=${encodeURIComponent(manualToken.trim())}`);
  };

  return (
    <div className="space-y-4 py-6">
      <section className="rounded-[32px] border border-muted bg-card p-6 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Camera mode</p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">BEEP SOMEONE</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Point at their badge and we instantly script the follow-up conversation.
        </p>
      </section>

      <div className="flex flex-col items-center gap-4">
        <div className="w-full max-w-md rounded-[32px] border border-muted bg-card p-6 text-center shadow-lg">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Camera is live</p>
          <p className="mt-2 text-sm text-muted-foreground">Line up the QR until the corners glow.</p>
          <div className="relative mt-4 rounded-3xl border border-slate-900/10 bg-slate-900/80 p-3">
            <div
              ref={readerContainerRef}
              id="qr-reader"
              className="aspect-square rounded-2xl bg-black flex items-center justify-center"
            >
              {!scanning && !loading && <Camera className="h-12 w-12 text-white/50" />}
              {loading && <Loader2 className="h-10 w-10 animate-spin text-white" />}
            </div>
            <div className="pointer-events-none absolute inset-0 flex justify-between">
              <div className="m-4 h-10 w-10 border-t-4 border-l-4 border-emerald-400" />
              <div className="m-4 h-10 w-10 border-t-4 border-r-4 border-emerald-400" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between">
              <div className="m-4 h-10 w-10 border-b-4 border-l-4 border-emerald-400" />
              <div className="m-4 h-10 w-10 border-b-4 border-r-4 border-emerald-400" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Move closer - keep both badges inside the frame.</p>
          <div className="mt-4 space-y-2">
            {!scanning && !loading && (
              <Button onClick={startScanner} className="w-full" size="lg">
                <Camera className="mr-2 h-5 w-5" />
                Start camera
              </Button>
            )}
            {scanning && (
              <Button onClick={stopScanner} variant="destructive" className="w-full" size="lg">
                Stop scanning
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowManual((prev) => !prev)} className="w-full">
              {showManual ? 'Hide manual entry' : 'Enter code manually'}
            </Button>
          </div>
        </div>

        {showManual && (
          <div className="w-full max-w-md rounded-[32px] border border-muted bg-card p-6 shadow-lg">
            <p className="text-lg font-semibold text-foreground">Manual token entry</p>
            <form onSubmit={handleManualSubmit} className="mt-4 space-y-4">
              <Input
                value={manualToken}
                onChange={(event) => setManualToken(event.target.value)}
                placeholder="Paste token"
                aria-label="Token"
              />
              <Button type="submit" className="rounded-full">
                Go
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
