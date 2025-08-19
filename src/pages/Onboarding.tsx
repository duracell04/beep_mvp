import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useEvent } from '../context/EventContext';
import BeepLogo from '../components/BeepLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

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
    <div className="flex items-center justify-center py-10">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="flex flex-col items-center gap-3">
          <BeepLogo withWordmark className="h-16" />
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Enter your event code to begin
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Event code"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              hint="Your event code is 4 digits"
              className="text-center text-2xl tracking-widest"
            />
            <Button type="submit" disabled={!isValid} className="w-full">
              Join
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
