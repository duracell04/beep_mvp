'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvent } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [code, setCode] = useState('');
  const { setEventCode } = useEvent();
  const { toast } = useToast();
  const router = useRouter();

  const handleJoin = (event?: FormEvent) => {
    event?.preventDefault();

    if (!/^\d{4}$/.test(code)) {
      toast({
        title: 'Invalid code',
        description: 'Enter the 4-digit event code to launch Active Mode.',
        variant: 'destructive',
      });
      return;
    }

    setEventCode(code);
    router.push('/quiz');
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-[32px] bg-card shadow-2xl ring-1 ring-muted">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold">
                TC
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Hosted brand</p>
                <p className="text-xl font-semibold">TechCorp Summit 2025</p>
              </div>
              <span className="ml-auto rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-widest text-white/80">
                Custom branding
              </span>
            </div>
            <p className="mt-4 text-sm text-white/80">
              Drop your buyer&apos;s logo up top and let every employee join from a mobile browser.
            </p>
          </div>

          <div className="space-y-6 p-6 text-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                Zero-friction entry
              </p>
              <h1 className="text-3xl font-semibold text-foreground">Enter Event Code</h1>
              <p className="text-sm text-muted-foreground">
                No download required. Join in 30 seconds.
              </p>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                aria-label="Event code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0000"
                className="text-center text-4xl tracking-[0.5em]"
              />
              <Button
                type="submit"
                disabled={code.length !== 4}
                className="w-full rounded-2xl py-6 text-base uppercase tracking-[0.3em]"
              >
                Launch active mode
              </Button>
              <p className="text-xs text-muted-foreground">
                Already invited? Tap the code on your badge or reply to the SMS reminder.
              </p>
            </form>

            <div className="rounded-2xl border border-dashed border-muted p-4 text-left text-sm text-muted-foreground">
              <p className="text-base font-semibold text-foreground">Why this sells</p>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Proves employees can join inside 30 seconds in any mobile browser.</li>
                <li>Creates the &quot;all-in-one&quot; feeling &mdash; entry, quiz, badge, scan &mdash; with zero IT lift.</li>
                <li>Sets up your &ldquo;Break the Ice - One beep at a time&rdquo; moment before any install.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
