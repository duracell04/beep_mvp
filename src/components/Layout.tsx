import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from '@/components/ui/toaster';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
