import { UserPlus, Briefcase, Brain, MessageSquare, Play } from 'lucide-react';
import { Card, Avatar } from '@/components/ui';
import { formatRelative } from '@/lib/format';
import type { ActivityItem } from '@/services/dashboard.service';

const typeIcons: Record<ActivityItem['type'], typeof UserPlus> = {
  user_joined: UserPlus,
  candidature_sent: Briefcase,
  ai_call: Brain,
  post_created: MessageSquare,
  atelier_watched: Play,
};

const typeColors: Record<ActivityItem['type'], string> = {
  user_joined: 'text-green',
  candidature_sent: 'text-gold',
  ai_call: 'text-rose',
  post_created: 'text-muted',
  atelier_watched: 'text-brown-light',
};

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const items = activities.slice(0, 10);

  return (
    <Card title="Activite recente" noPadding>
      <ul className="divide-y divide-gray-200">
        {items.map((activity) => {
          const Icon = typeIcons[activity.type] ?? MessageSquare;
          const iconColor = typeColors[activity.type] ?? 'text-muted';

          return (
            <li
              key={activity.id}
              className="flex items-center gap-3 px-6 py-3"
            >
              <Avatar name={activity.user_name} size="sm" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-brown">
                  {activity.description}
                </p>
                <p className="text-xs text-muted">
                  {formatRelative(activity.timestamp)}
                </p>
              </div>

              <Icon size={16} className={iconColor} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
