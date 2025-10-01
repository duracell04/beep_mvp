import { NavLink } from 'react-router-dom';
import { BeepLogo } from './BeepLogo';
import { cn } from '@/lib/utils';

export default function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-accent/20',
      isActive ? 'text-primary' : 'text-muted-foreground'
    );

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2" aria-label="Home">
          <BeepLogo variant="monogram" className="h-8 w-8 text-primary" />
          <span className="text-base font-semibold text-foreground">Beep</span>
        </NavLink>
        <nav className="flex gap-1">
          <NavLink to="/onboarding" className={linkClass}>
            Onboarding
          </NavLink>
          <NavLink to="/quiz" className={linkClass}>
            Quiz
          </NavLink>
          <NavLink to="/myqr" className={linkClass}>
            My Code
          </NavLink>
          <NavLink to="/scan" className={linkClass}>
            Scan
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
