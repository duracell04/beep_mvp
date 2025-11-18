import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Providers from '@/components/Providers';
import Layout from '@/components/Layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beep Active Mode',
  description: 'Break the ice - one Beep at a time.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
