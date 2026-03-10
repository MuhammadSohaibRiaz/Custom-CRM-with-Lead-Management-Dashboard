import { cn } from '@/lib/utils';
import { LeadStatus, LEAD_STATUS_CONFIG } from '@/types/database';

interface BadgeProps {
  status: LeadStatus;
  className?: string;
}

export default function Badge({ status, className }: BadgeProps) {
  const config = LEAD_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
