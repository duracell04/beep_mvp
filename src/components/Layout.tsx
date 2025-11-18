'use client';

import type { ReactNode } from 'react';
import Header from './Header';
import DevNav from './DevNav';
import { Toaster } from '@/components/ui/toaster';

const showDevNav = process.env.NODE_ENV !== 'production';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {showDevNav && <DevNav />}
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
      <Toaster />
    </div>
  );
}
