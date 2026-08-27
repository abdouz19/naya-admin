import { useMemo } from 'react';
import { Shield } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import type { CommunityPost } from '@/types/community';
import { PostCard } from './PostCard';

interface ReportsListProps {
  posts: CommunityPost[];
  onModerate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReportsList({ posts, onModerate, onDelete }: ReportsListProps) {
  const sorted = useMemo(() => {
    return [...posts]
      .filter((p) => p.reports_count > 0)
      .sort((a, b) => b.reports_count - a.reports_count);
  }, [posts]);

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={Shield}
        title="Aucun signalement"
        description="Tous les posts sont en regle."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sorted.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onModerate={onModerate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
