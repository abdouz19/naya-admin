import { useCallback, useMemo, useState } from 'react';
import { Spinner, Tabs, Modal, Button } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import { getPosts } from '@/services/community.service';
import type { CommunityPost } from '@/types/community';
import { PostCard } from './PostCard';
import { ReportsList } from './ReportsList';

export default function CommunityPage() {
  const postsFn = useCallback(() => getPosts(), []);
  const { data: fetchedPosts, loading } = useService<CommunityPost[]>(postsFn);

  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Sync fetched data to local state (once loaded)
  const currentPosts = useMemo(() => {
    if (posts !== null) return posts;
    if (fetchedPosts) return fetchedPosts;
    return [];
  }, [posts, fetchedPosts]);

  // Initialize local state when data arrives
  if (fetchedPosts && posts === null) {
    setPosts(fetchedPosts);
  }

  const reportedPosts = useMemo(
    () => currentPosts.filter((p) => p.reports_count > 0),
    [currentPosts],
  );

  const handleModerate = useCallback((id: string) => {
    setPosts((prev) =>
      (prev ?? []).map((p) =>
        p.id === id ? { ...p, is_moderated: !p.is_moderated } : p,
      ),
    );
  }, []);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteTarget(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    setPosts((prev) => (prev ?? []).filter((p) => p.id !== deleteTarget));
    setDeleteTarget(null);
  }, [deleteTarget]);

  const tabs = useMemo(
    () => [
      { key: 'all', label: 'Tous les posts', count: currentPosts.length },
      { key: 'reported', label: 'Signales', count: reportedPosts.length },
    ],
    [currentPosts.length, reportedPosts.length],
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === 'all' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {currentPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onModerate={handleModerate}
              onDelete={handleDeleteRequest}
            />
          ))}
        </div>
      )}

      {activeTab === 'reported' && (
        <ReportsList
          posts={currentPosts}
          onModerate={handleModerate}
          onDelete={handleDeleteRequest}
        />
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Confirmer la suppression"
      >
        <p className="text-sm text-muted mb-6">
          Etes-vous sur de vouloir supprimer ce post ? Cette action est
          irreversible.
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
