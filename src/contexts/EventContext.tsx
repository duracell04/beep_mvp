'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface EventContextType {
  eventCode: string | null;
  setEventCode: (code: string) => void;
  clearEvent: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [eventCode, setEventCodeState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    setEventCodeState(localStorage.getItem('beep_event_code'));
  }, []);

  const setEventCode = (code: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem('beep_event_code', code);
    setEventCodeState(code);
  };

  const clearEvent = () => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem('beep_event_code');
    localStorage.removeItem('beep_quiz_answers');
    setEventCodeState(null);
  };

  return (
    <EventContext.Provider value={{ eventCode, setEventCode, clearEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return context;
};
