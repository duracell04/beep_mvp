import React from 'react';
import { cn } from '../../lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warn' | 'error';
}

const variants: Record<NonNullable<AlertProps['variant']>, string> = {
  info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  success: 'bg-[var(--beep-bot)]/20 text-[var(--beep-bot)]',
  warn: 'bg-[var(--beep-mid)]/20 text-[var(--beep-mid)]',
  error: 'bg-[var(--beep-top)]/20 text-[var(--beep-top)]',
};

export default function Alert({ variant = 'info', className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn('rounded-md px-4 py-3 text-sm', variants[variant], className)}
      {...props}
    />
  );
}
