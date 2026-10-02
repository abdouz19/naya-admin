import { useCallback, useMemo, useState } from 'react';
import {
  BookOpen,
  Plus,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import { Card, Spinner, Stat, Button, Badge } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getAdminBlogArticles,
  getBlogStats,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
} from '@/services/blog.service';
import type { BlogArticle, BlogStats } from '@/types/blog';
import { formatNumber } from '@/lib/format';
import { BlogArticleModal } from './BlogArticleModal';

const CATEGORY_COLORS: Record<string, string> = {
  Confiance: 'bg-rose/10 text-rose border-rose/20',
  Reconversion: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Retour à l’emploi': 'bg-blue-50 text-blue-700 border-blue-200',
  'Création d’activité': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function BlogAdminPage() {
  const statsFn = useCallback(() => getBlogStats(), []);
  const articlesFn = useCallback(() => getAdminBlogArticles(), []);

  const {
    data: stats,
    loading: loadingStats,
    refetch: refetchStats,
  } = useService<BlogStats>(statsFn);

  const {
    data: articles,
    loading: loadingArticles,
    refetch: refetchArticles,
  } = useService<BlogArticle[]>(articlesFn);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingArticle(null);
    setModalOpen(true);
  };

  const openEditModal = (article: BlogArticle) => {
    setEditingArticle(article);
    setModalOpen(true);
  };

  const handleSave = async (
    data: Omit<BlogArticle, 'id' | 'viewsCount' | 'createdAt' | 'updatedAt'>,
  ) => {
    setSaving(true);
    try {
      if (editingArticle) {
        await updateBlogArticle(editingArticle.id, data);
      } else {
        await createBlogArticle(data);
      }
      setModalOpen(false);
      refetchArticles();
      refetchStats();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (article: BlogArticle) => {
    try {
      await updateBlogArticle(article.id, { isPublished: !article.isPublished });
      refetchArticles();
      refetchStats();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${title}" ?`)) {
      try {
        await deleteBlogArticle(id);
        refetchArticles();
        refetchStats();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    return articles.filter((a) => {
      const matchCat =
        selectedCategory === 'Tous' ||
        a.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const loading = loadingStats || loadingArticles;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-6">
          <Stat
            label="Total articles"
            value={formatNumber(stats?.totalArticles ?? 0)}
            icon={BookOpen}
          />
        </Card>
        <Card className="p-6">
          <Stat
            label="Articles en ligne"
            value={formatNumber(stats?.publishedArticles ?? 0)}
            icon={CheckCircle2}
          />
        </Card>
        <Card className="p-6">
          <Stat
            label="Brouillons"
            value={formatNumber(stats?.draftArticles ?? 0)}
            icon={FileText}
          />
        </Card>
        <Card className="p-6">
          <Stat
            label="Total lectures / vues"
            value={formatNumber(stats?.totalViews ?? 0)}
            icon={Eye}
          />
        </Card>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {['Tous', 'Confiance', 'Reconversion', 'Retour à l’emploi', 'Création d’activité'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-brown text-cream shadow-sm'
                    : 'bg-white text-muted hover:bg-sand/30 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ),
          )}
        </div>

        {/* Search & Add CTA */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 bg-white text-brown outline-none transition focus:border-rose placeholder:text-muted w-60"
            />
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={openAddModal}
          >
            Nouvel article
          </Button>
        </div>
      </div>

      {/* Articles List / Table */}
      <Card className="overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-brown">
            <thead className="bg-gray-50/75 border-b border-gray-200/60 text-xs font-semibold text-muted uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Lecture</th>
                <th className="py-3.5 px-4">Lectures</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    Aucun article trouvé pour cette recherche ou catégorie.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-sand/10 transition-colors"
                  >
                    <td className="py-4 px-4 max-w-md">
                      <div className="font-heading font-semibold text-brown text-sm line-clamp-1">
                        {article.title}
                      </div>
                      <div className="text-xs text-muted line-clamp-1 mt-0.5">
                        {article.subtitle}
                      </div>
                      {article.keyTakeaway && (
                        <div className="flex items-center gap-1 text-[11px] text-rose mt-1">
                          <Sparkles size={11} className="shrink-0" />
                          <span className="truncate italic">
                            « {article.keyTakeaway} »
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          CATEGORY_COLORS[article.category] ||
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {article.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-muted">
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{article.readTimeMinutes} min</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs font-semibold text-brown">
                      <div className="flex items-center gap-1.5">
                        <Eye size={13} className="text-muted" />
                        <span>{formatNumber(article.viewsCount || 0)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        className="cursor-pointer transition hover:opacity-80"
                        title="Cliquer pour changer le statut"
                      >
                        {article.isPublished ? (
                          <Badge variant="green">Publié</Badge>
                        ) : (
                          <Badge variant="muted">Brouillon</Badge>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(article)}
                          className="p-1.5 text-muted hover:text-brown rounded-md hover:bg-gray-100 transition"
                          title="Modifier"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-1.5 text-muted hover:text-red-600 rounded-md hover:bg-red-50 transition"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <BlogArticleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        article={editingArticle}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
