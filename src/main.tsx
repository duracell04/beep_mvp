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
  </React.StrictMode>,
);

const updateServiceWorker = registerSW({
  immediate: true,
  onNeedRefresh() {
    const toast = document.createElement('div');
    toast.textContent = 'New version available — ';
    const refresh = document.createElement('button');
    refresh.textContent = 'Refresh';
    toast.appendChild(refresh);
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      background: '#fff',
      padding: '0.5rem 1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      zIndex: '1000',
    });
    refresh.style.marginLeft = '0.5rem';
    refresh.addEventListener('click', async () => {
      await updateServiceWorker();
      location.reload();
    });
    document.body.appendChild(toast);
  },
});
