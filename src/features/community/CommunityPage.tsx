import { useCallback, useMemo, useState } from 'react';
import { Spinner, Tabs, Modal, Button, Pagination, SearchInput } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getPostsPage,
  moderatePost,
  deletePost,
  type PostFilter,
  type PostsPage,
} from '@/services/community.service';
import type { CommunityPost } from '@/types/community';
import { PostCard } from './PostCard';
import { ReportsList } from './ReportsList';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<PostFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const postsFn = useCallback(
    () => getPostsPage(page, { filter: activeTab, search }),
    [page, activeTab, search],
  );
  const { data: postsPage, loading, refetch } = useService<PostsPage>(postsFn);

  // Local copy of the page, so moderation and deletion show at once.
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [syncedPage, setSyncedPage] = useState<PostsPage | null>(null);

  // A new page arrived: show it. If the last post of a page was deleted,
  // go back one page.
  if (postsPage && postsPage !== syncedPage) {
    setSyncedPage(postsPage);
    setPosts(postsPage.items);
    if (postsPage.items.length === 0 && page > 1) setPage(page - 1);
  }

  const currentPosts = posts ?? postsPage?.items ?? [];

  // Searching or changing tab starts again from the first page.
  const changeFilter =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setPage(1);
    };

  const handleModerate = useCallback(async (id: string) => {
    setPosts((prev) =>
      (prev ?? []).map((p) =>
        p.id === id ? { ...p, is_moderated: !p.is_moderated } : p,
      ),
    );
    try {
      await moderatePost(id);
      refetch();
    } catch (e) {
      console.error(e);
    }
  }, [refetch]);

  const handleDeleteRequest = useCallback((id: string) => {
    setDeleteTarget(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget;
    setPosts((prev) => (prev ?? []).filter((p) => p.id !== targetId));
    setDeleteTarget(null);
    try {
      await deletePost(targetId);
      refetch();
    } catch (e) {
      console.error(e);
    }
  }, [deleteTarget, refetch]);

  const tabs = useMemo(
    () => [
      { key: 'all', label: 'Tous les posts', count: postsPage?.counts.all },
      { key: 'reported', label: 'Signales', count: postsPage?.counts.reported },
    ],
    [postsPage],
  );

  if (loading && !postsPage) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => changeFilter(setActiveTab)(key as PostFilter)}
      />

      <SearchInput
        value={search}
        onSearch={changeFilter(setSearch)}
        placeholder="Rechercher un post ou une autrice..."
        className="max-w-md"
      />

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

      {postsPage && (
        <Pagination
          page={postsPage.page}
          pageSize={postsPage.pageSize}
          total={postsPage.total}
          onPageChange={setPage}
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
