import { Avatar } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import type { ActivityLogEntry } from '@/types/database';
import {
  UserPlus,
  ArrowRightLeft,
  MessageSquare,
  PlusCircle,
  Activity,
} from 'lucide-react';

interface ActivityTimelineProps {
  activities: ActivityLogEntry[];
}

const actionIcons: Record<string, typeof Activity> = {
  lead_created: PlusCircle,
  status_changed: ArrowRightLeft,
  lead_assigned: UserPlus,
  note_added: MessageSquare,
};

function getActionText(action: string, details: Record<string, unknown>): string {
  switch (action) {
    case 'lead_created':
      return `Created this lead`;
    case 'status_changed':
      return `Changed status from "${details.from}" to "${details.to}"`;
    case 'lead_assigned':
      return 'Assigned this lead';
    case 'note_added':
      return 'Added a note';
    default:
      return action.replace(/_/g, ' ');
  }
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">No activity yet</p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => {
        const Icon = actionIcons[activity.action] || Activity;
        return (
          <div key={activity.id} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <Icon className="h-4 w-4" />
              </div>
              {idx < activities.length - 1 && (
                <div className="mt-1 h-full w-px bg-gray-200" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{activity.user?.full_name || 'System'}</span>{' '}
                {getActionText(activity.action, activity.details)}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                {formatRelativeTime(activity.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
