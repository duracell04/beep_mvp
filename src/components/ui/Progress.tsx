import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
}

export default function Progress({ value, max, className }: ProgressProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={cn('h-2 w-full rounded bg-slate-200 dark:bg-slate-700', className)}>
      <div
        className="h-full rounded bg-brand transition-all duration-200"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
