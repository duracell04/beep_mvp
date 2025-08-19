// Reusable beep logo with variants that inherit currentColor.
// Props: variant ('ping' | 'traffic' | 'scan' | 'monogram'), withWordmark, className.
type Variant = 'ping' | 'traffic' | 'scan' | 'monogram';

interface Props {
  variant?: Variant;
  withWordmark?: boolean;
  className?: string;
  sizeEm?: number; // optional; defaults to 1.6
}

function PingMark({ sizeEm = 1.6 }: { sizeEm?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
         width={`${sizeEm}em`} height={`${sizeEm}em`} aria-hidden="true">
      <circle cx="22" cy="32" r="6" fill="currentColor"/>
      <path d="M32 24 A10 10 0 0 1 32 40" fill="none"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M38 18 A16 16 0 0 1 38 46" fill="none"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".6"/>
      <path d="M44 12 A22 22 0 0 1 44 52" fill="none"
            stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".3"/>
    </svg>
  );
}

function TrafficMark({ sizeEm = 1.6 }: { sizeEm?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
         width={`${sizeEm}em`} height={`${sizeEm}em`} aria-hidden="true">
      <rect x="18" y="8" width="28" height="48" rx="14"
            fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="32" cy="20" r="6" fill="var(--beep-top, currentColor)" opacity=".45"/>
      <circle cx="32" cy="32" r="6" fill="var(--beep-mid, currentColor)" opacity=".7"/>
      <circle cx="32" cy="44" r="6" fill="var(--beep-bot, currentColor)"/>
    </svg>
  );
}

function ScanMark({ sizeEm = 1.6 }: { sizeEm?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
         width={`${sizeEm}em`} height={`${sizeEm}em`} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M12 22 V12 H22" /><path d="M42 12 H52 V22" />
        <path d="M12 42 V52 H22" /><path d="M52 42 V52 H42" />
      </g>
      <circle cx="32" cy="32" r="6" fill="currentColor"/>
    </svg>
  );
}

function MonogramMark({ sizeEm = 1.6 }: { sizeEm?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
         width={`${sizeEm}em`} height={`${sizeEm}em`} aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"/>
      <rect x="24" y="18" width="8" height="28" rx="4" fill="currentColor"/>
      <circle cx="36" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="8"/>
    </svg>
  );
}

export default function BeepLogo({
  variant = 'ping',
  withWordmark = false,
  className = '',
  sizeEm = 1.6,
}: Props) {
  const Mark =
    variant === 'traffic' ? TrafficMark :
    variant === 'scan'    ? ScanMark    :
    variant === 'monogram'? MonogramMark: PingMark;

  return (
    <span
      className={`inline-flex items-center gap-[0.55ch] text-slate-900 ${className}`}
      role="img" aria-label="beep"
    >
      <Mark sizeEm={sizeEm} />
      {withWordmark && (
        <strong style={{ font: '600 1rem/1 system-ui,Segoe UI,Inter,Arial' }}>
          beep
        </strong>
      )}
    </span>
  );
}
