import React, { createContext, useContext, useState } from 'react';

interface EventContextValue {
  eventCode: string;
  setEventCode: React.Dispatch<React.SetStateAction<string>>;
}

const EventContext = createContext<EventContextValue | undefined>(undefined);

export const EventProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [eventCode, setEventCode] = useState('');
  return (
    <EventContext.Provider value={{ eventCode, setEventCode }}>
      {children}
    </EventContext.Provider>
  );
};

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return context;
}
