import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EventProvider } from './context/EventContext';
import { QuizProvider } from './contexts/QuizContext';
import { registerSW } from 'virtual:pwa-register';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EventProvider>
      <QuizProvider>
        <App />
      </QuizProvider>
    </EventProvider>
  </React.StrictMode>
);

registerSW({ immediate: true });
