import type { CommunityPost, CommunityReport } from '@/types/community';
import { supabaseRest } from '@/lib/supabase-client';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryPosts: CommunityPost[] = [];
let inMemoryReports: CommunityReport[] = [];

export async function getPosts(): Promise<CommunityPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/community/admin/posts`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.posts) && data.posts.length > 0) {
        inMemoryPosts = data.posts;
        return data.posts;
      }
    }
  } catch (_) {
    // fallback
  }

  // Supabase direct fallback
  const dbPosts = await supabaseRest<CommunityPost[]>('community_posts?select=*&order=created_at.desc');
  if (dbPosts && Array.isArray(dbPosts) && dbPosts.length > 0) {
    inMemoryPosts = dbPosts;
    return dbPosts;
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
    const res = await fetch(`${API_BASE_URL}/community/admin/posts/${id}/moderate`, {
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
    const res = await fetch(`${API_BASE_URL}/community/admin/posts/${id}`, {
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
