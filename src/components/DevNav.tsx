'use client';

import Link from 'next/link';

/**
 * Lightweight nav helpers rendered only in development to jump between flows quickly.
 */
export default function DevNav() {
  return (
    <nav className="flex gap-4 bg-gray-200 p-2 text-sm text-gray-800">
      <Link href="/onboarding">Onboarding</Link>
      <Link href="/quiz">Quiz</Link>
      <Link href="/myqr">My QR</Link>
      <Link href="/scan">Scan</Link>
      <Link href="/match">Match</Link>
      <Link href="/admin">Admin</Link>
    </nav>
  );
}
