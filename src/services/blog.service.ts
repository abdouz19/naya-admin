import { mockBlogArticles } from '@/data/mock-blog';
import type { BlogArticle, BlogStats } from '@/types/blog';
import { apiFetch } from '@/lib/api';
import { PAGE_SIZE, type Paginated } from '@/types/pagination';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryArticles = [...mockBlogArticles];

export interface BlogListFilters {
  search?: string;
  category?: string;
}

/** One page of articles, searched and filtered by the API. */
export async function getAdminBlogArticlesPage(
  page: number,
  filters: BlogListFilters = {},
  pageSize = PAGE_SIZE,
): Promise<Paginated<BlogArticle>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.category && filters.category !== 'Tous') {
    params.set('category', filters.category);
  }
  const res = await apiFetch(`${API_BASE_URL}/blog/admin/articles?${params}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Les articles n’ont pas pu être chargés.');
  return res.json();
}

/** Every article matching the filters (stats). */
export async function getAdminBlogArticles(
  filters: BlogListFilters = {},
): Promise<BlogArticle[]> {
  try {
    const all: BlogArticle[] = [];
    for (let page = 1; page <= 100; page++) {
      const result = await getAdminBlogArticlesPage(page, filters, 100);
      all.push(...result.items);
      if (all.length >= result.total || result.items.length === 0) break;
    }
    inMemoryArticles = all;
    return all;
  } catch {
    // fallback to local mock
  }
  return [...inMemoryArticles];
}

export async function getBlogStats(): Promise<BlogStats> {
  const articles = await getAdminBlogArticles();
  const published = articles.filter((a) => a.isPublished).length;
  const draft = articles.length - published;
  const totalViews = articles.reduce((acc, a) => acc + (a.viewsCount || 0), 0);

  const categoryCounts: Record<string, number> = {};
  articles.forEach((a) => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + (a.viewsCount || 0);
  });
  let mostReadCategory = 'Confiance';
  let maxViews = -1;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxViews) {
      maxViews = count;
      mostReadCategory = cat;
    }
  });

  return {
    totalArticles: articles.length,
    publishedArticles: published,
    draftArticles: draft,
    totalViews,
    mostReadCategory,
  };
}

export async function createBlogArticle(
  dto: Omit<BlogArticle, 'id' | 'viewsCount' | 'createdAt' | 'updatedAt'>,
): Promise<BlogArticle> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/blog/admin/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.article) {
        inMemoryArticles.unshift(data.article);
        return data.article;
      }
    }
  } catch (_) {
    // fallback
  }

  const now = new Date().toISOString();
  const newArticle: BlogArticle = {
    ...dto,
    id: dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `art-${Date.now()}`,
    viewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  inMemoryArticles = [newArticle, ...inMemoryArticles];
  return newArticle;
}

export async function updateBlogArticle(
  id: string,
  dto: Partial<BlogArticle>,
): Promise<BlogArticle> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/blog/admin/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.article) {
        const idx = inMemoryArticles.findIndex((a) => a.id === id);
        if (idx !== -1) {
          inMemoryArticles[idx] = data.article;
        } else {
          inMemoryArticles.unshift(data.article);
        }
        return data.article;
      }
    }
  } catch (_) {
    // fallback
  }

  const idx = inMemoryArticles.findIndex((a) => a.id === id);
  if (idx !== -1) {
    inMemoryArticles[idx] = {
      ...inMemoryArticles[idx],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryArticles[idx];
  }
  throw new Error('Article non trouvé');
}

export async function deleteBlogArticle(id: string): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/blog/admin/articles/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      inMemoryArticles = inMemoryArticles.filter((a) => a.id !== id);
      return true;
    }
  } catch (_) {
    // fallback
  }

  inMemoryArticles = inMemoryArticles.filter((a) => a.id !== id);
  return true;
}
