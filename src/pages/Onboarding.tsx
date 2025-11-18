import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useEvent } from '../context/EventContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Onboarding() {
  const { setEventCode } = useEvent();
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const schema = z.string().regex(/^\d{4}$/);
  const isValid = schema.safeParse(code).success;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setEventCode(code);
    navigate('/quiz');
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-slate-100">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-semibold">
                TC
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Hosted brand
                </p>
                <p className="text-xl font-semibold">TechCorp Summit 2025</p>
              </div>
              <span className="ml-auto rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-widest text-white/80">
                Custom branding
              </span>
            </div>
            <p className="mt-4 text-sm text-white/80">
              Drop your buyer&rsquo;s logo up top and let every employee join from a mobile browser.
            </p>
          </div>

          <div className="space-y-6 p-6 text-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Zero-friction entry
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">Enter Event Code</h1>
              <p className="text-sm text-slate-500">
                No download required. Join in 30 seconds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                aria-label="Event code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="0000"
                hint="Shared via calendar hold or welcome signage"
                className="text-center text-4xl tracking-[0.5em]"
              />
              <Button
                type="submit"
                disabled={!isValid}
                className="w-full rounded-2xl py-6 text-base uppercase tracking-[0.3em]"
              >
                Launch active mode
              </Button>
              <p className="text-xs text-slate-400">
                Already invited? Tap the code on your badge or reply to the SMS reminder.
              </p>
            </form>

            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-left text-sm text-slate-600">
              <p className="text-base font-semibold text-slate-800">Why this sells</p>
              <ul className="mt-3 space-y-2">
                <li>Proves employees can join inside 30 seconds in any mobile browser.</li>
                <li>Creates the "all-in-one" feeling entry, quiz, badge, scan with zero IT lift.</li>
                <li>Sets up your Break the Ice - One beep at a time moment before they even install anything.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
