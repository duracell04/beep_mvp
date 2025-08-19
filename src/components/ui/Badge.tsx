import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'error';
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100',
  success: 'bg-[var(--beep-bot)]/20 text-[var(--beep-bot)]',
  warning: 'bg-[var(--beep-mid)]/20 text-[var(--beep-mid)]',
  error: 'bg-[var(--beep-top)]/20 text-[var(--beep-top)]',
};

export default function Badge({
  variant = 'neutral',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
