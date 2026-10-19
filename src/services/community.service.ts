import type { CommunityPost, CommunityReport } from '@/types/community';
import { apiFetch } from '@/lib/api';
import { PAGE_SIZE, type Paginated } from '@/types/pagination';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryPosts: CommunityPost[] = [];
let inMemoryReports: CommunityReport[] = [];

export type PostFilter = 'all' | 'reported';

export interface PostListFilters {
  filter?: PostFilter;
  search?: string;
}

/** A page of posts, plus the totals of the "all" and "reported" tabs. */
export type PostsPage = Paginated<CommunityPost> & {
  counts: { all: number; reported: number };
};

/** One page of posts, filtered and searched by the API. */
export async function getPostsPage(
  page: number,
  filters: PostListFilters = {},
  pageSize = PAGE_SIZE,
): Promise<PostsPage> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.filter && filters.filter !== 'all') params.set('filter', filters.filter);
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  const res = await apiFetch(`${API_BASE_URL}/community/admin/posts?${params}`);
  if (!res.ok) throw new Error('Les publications n’ont pas pu être chargées.');
  return res.json();
}

/** Every post (dashboard figures). */
export async function getPosts(): Promise<CommunityPost[]> {
  try {
    const all: CommunityPost[] = [];
    for (let page = 1; page <= 100; page++) {
      const result = await getPostsPage(page, {}, 100);
      all.push(...result.items);
      if (all.length >= result.total || result.items.length === 0) break;
    }
    inMemoryPosts = all;
    return all;
  } catch {
    // fallback
  }

  return inMemoryPosts;
}

export async function getReportedPosts(): Promise<
  { post: CommunityPost; reports: CommunityReport[] }[]
> {
  const posts = await getPosts();
  const reported = posts.filter((p) => (p.reports_count ?? 0) > 0);
  return reported.map((post) => ({
    post,
    reports: inMemoryReports.filter((r) => r.post_id === post.id),
  }));
}

export async function moderatePost(
  id: string,
  isModerated?: boolean,
): Promise<CommunityPost | undefined> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/community/admin/posts/${id}/moderate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isModerated !== undefined ? { is_moderated: isModerated } : {}),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.post) return data.post;
    }
  } catch (_) {
    // fallback
  }

  const post = inMemoryPosts.find((p) => p.id === id);
  if (post) {
    post.is_moderated = isModerated !== undefined ? isModerated : !post.is_moderated;
  }
  return post;
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/community/admin/posts/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      inMemoryPosts = inMemoryPosts.filter((p) => p.id !== id);
      return true;
    }
  } catch (_) {
    // fallback
  }

  const index = inMemoryPosts.findIndex((p) => p.id === id);
  if (index !== -1) {
    inMemoryPosts.splice(index, 1);
    return true;
  }
  return false;
}
