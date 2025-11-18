'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Download } from 'lucide-react';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generateToken, buildQrPayload, withEventCode } from '@/lib/session';
import { saveSession } from '@/api/sessions';
import { Loader2 } from 'lucide-react';

const MyQR = () => {
  const { eventCode } = useEvent();
  const { answers, isComplete } = useQuiz();
  const router = useRouter();
  const { toast } = useToast();
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(true);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eventCode || !isComplete || !answers) {
      router.replace('/onboarding');
      return;
    }

    let cancelled = false;

    const generateQr = async () => {
      try {
        const token = generateToken();
        await saveSession(token, eventCode, withEventCode(answers, eventCode));
        if (!cancelled) {
          setQrValue(buildQrPayload(token, eventCode));
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to generate QR', error);
        toast({
          title: 'Error',
          description: 'Unable to create your badge. Please try again.',
          variant: 'destructive',
        });
      }
    };

    generateQr();
    const interval = setInterval(generateQr, 90_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [eventCode, isComplete, answers, router, toast]);

  const copyLink = () => {
    if (!qrValue) return;
    navigator.clipboard?.writeText(qrValue).then(() => {
      toast({
        title: 'Link copied',
        description: 'Share this with anyone who needs your badge.',
      });
    });
  };

  const downloadPng = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'beep-badge.png';
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <section className="rounded-[32px] bg-gradient-to-r from-emerald-500 via-emerald-500 to-lime-400 p-6 text-center text-white shadow-xl">
        <p className="text-xs uppercase tracking-[0.6em] text-white/80">Active mode</p>
        <h1 className="mt-2 text-3xl font-semibold">Scan &amp; be scanned</h1>
        <p className="mt-3 text-base text-white/90">Break the Ice &mdash; One beep at a time.</p>
      </section>

      <div className="overflow-hidden rounded-[32px] border border-muted bg-card shadow-2xl">
        <div className="flex flex-col items-center gap-4 border-b border-muted/50 p-6 text-center">
          <Badge variant="outline" className="uppercase tracking-[0.4em]">
            Live badge
          </Badge>
          <p className="text-sm text-muted-foreground">
            Your dynamic QR proves the attendee is authenticated and rotating every 90 seconds.
          </p>
          <div
            ref={qrRef}
            className="rounded-3xl border border-muted bg-muted/30 p-4 shadow-inner"
          >
            {qrValue && <QRCodeCanvas value={qrValue} size={240} includeMargin />}
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Refreshes automatically
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="flex items-center gap-1 rounded-full px-4"
            >
              <Copy className="h-4 w-4" /> Copy link
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadPng}
              className="flex items-center gap-1 rounded-full px-4 text-muted-foreground"
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
            onClick={() => router.push('/scan')}
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
};

export default MyQR;
