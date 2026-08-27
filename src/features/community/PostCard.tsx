import { Heart, Flag, EyeOff, Eye, Trash2 } from 'lucide-react';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { formatRelative } from '@/lib/format';
import type { CommunityPost } from '@/types/community';
import { POST_TYPE_LABELS } from '@/types/community';
import { cn } from '@/lib/cn';

interface PostCardProps {
  post: CommunityPost;
  onModerate: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeBadgeVariant: Record<string, 'rose' | 'gold' | 'green' | 'muted'> = {
  normal: 'muted',
  victoire: 'green',
  question: 'gold',
  temoignage: 'rose',
};

export function PostCard({ post, onModerate, onDelete }: PostCardProps) {
  return (
    <Card
      className={cn(
        'p-4 space-y-3 transition-opacity',
        post.is_moderated && 'opacity-60',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar name={post.auteur} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-brown truncate">
              {post.auteur}
            </span>
            <span className="text-xs text-muted">
              {formatRelative(post.created_at)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {post.is_moderated && (
            <Badge variant="muted">Masque</Badge>
          )}
          <Badge variant={typeBadgeVariant[post.type] ?? 'muted'}>
            {POST_TYPE_LABELS[post.type]}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-ink line-clamp-3">{post.contenu}</p>

      {/* Footer: reactions + reports */}
      <div className="flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Heart size={13} />
          {post.reactions_count}
        </span>
        {post.reports_count > 0 && (
          <span className="inline-flex items-center gap-1 text-danger font-medium">
            <Flag size={13} />
            {post.reports_count} signalement{post.reports_count > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          icon={post.is_moderated ? <Eye size={14} /> : <EyeOff size={14} />}
          onClick={() => onModerate(post.id)}
        >
          {post.is_moderated ? 'Afficher' : 'Masquer'}
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={<Trash2 size={14} />}
          onClick={() => onDelete(post.id)}
        >
          Supprimer
        </Button>
      </div>
    </Card>
  );
}
