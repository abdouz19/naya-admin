import { mockPosts, mockReports } from '@/data/mock-community';
import type { CommunityPost, CommunityReport } from '@/types/community';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let inMemoryPosts = [...mockPosts];
let inMemoryReports = [...mockReports];

export async function getPosts(): Promise<CommunityPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/community/admin/posts`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.posts) && data.posts.length > 0) {
        return data.posts;
      }
    }
  } catch (_) {
    // fallback
  }
  return [...inMemoryPosts];
}

export async function getReportedPosts(): Promise<
  { post: CommunityPost; reports: CommunityReport[] }[]
> {
  try {
    const [postsRes, reportsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/community/admin/posts`),
      fetch(`${API_BASE_URL}/community/admin/reports`),
    ]);

    if (postsRes.ok && reportsRes.ok) {
      const postsData = await postsRes.json();
      const reportsData = await reportsRes.json();
      const posts: CommunityPost[] = postsData.posts ?? [];
      const reports: CommunityReport[] = reportsData.reports ?? [];

      const reported = posts.filter((p) => (p.reports_count ?? 0) > 0);
      return reported.map((post) => ({
        post,
        reports: reports.filter((r) => r.post_id === post.id),
      }));
    }
  } catch (_) {
    // fallback
  }

  const reported = inMemoryPosts.filter((p) => p.reports_count > 0);
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
