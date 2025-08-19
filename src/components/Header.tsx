import { NavLink } from 'react-router-dom';
import BeepLogo from './BeepLogo';
import { cn } from '../lib/utils';

export default function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800',
      isActive
        ? 'text-brand dark:text-white'
        : 'text-slate-600 dark:text-slate-300'
    );

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex h-14 max-w-screen-md items-center justify-between px-4 md:px-6 lg:max-w-screen-lg">
        <NavLink to="/" className="flex items-center" aria-label="Home">
          <BeepLogo withWordmark className="h-6" />
        </NavLink>
        <nav className="flex gap-2">
          <NavLink to="/onboarding" className={linkClass}>
            Onboarding
          </NavLink>
          <NavLink to="/myqr" className={linkClass}>
            My QR
          </NavLink>
          <NavLink to="/scan" className={linkClass}>
            Scan
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
