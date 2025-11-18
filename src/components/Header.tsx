'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BeepLogo } from './BeepLogo';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/onboarding', label: 'Onboarding' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/myqr', label: 'My Code' },
  { href: '/scan', label: 'Scan' },
];

export default function Header() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    cn(
      'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-accent/20',
      pathname?.startsWith(href) ? 'text-primary' : 'text-muted-foreground',
    );

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <BeepLogo variant="monogram" className="h-8 w-8 text-primary" />
          <span className="text-base font-semibold text-foreground">Beep</span>
        </Link>
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
