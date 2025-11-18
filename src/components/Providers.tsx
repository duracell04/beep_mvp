'use client';

import type { ReactNode } from 'react';
import { EventProvider } from '@/contexts/EventContext';
import { QuizProvider } from '@/contexts/QuizContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <EventProvider>
      <QuizProvider>{children}</QuizProvider>
    </EventProvider>
  );
}
