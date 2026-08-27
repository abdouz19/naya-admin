import { mockPosts, mockReports } from '@/data/mock-community';
import type { CommunityPost, CommunityReport } from '@/types/community';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export function getPosts(): Promise<CommunityPost[]> {
  return delay([...mockPosts]);
}

export function getReportedPosts(): Promise<{ post: CommunityPost; reports: CommunityReport[] }[]> {
  const reported = mockPosts.filter((p) => p.reports_count > 0);
  const result = reported.map((post) => ({
    post,
    reports: mockReports.filter((r) => r.post_id === post.id),
  }));
  return delay(result);
}

export function moderatePost(id: string): Promise<CommunityPost | undefined> {
  const post = mockPosts.find((p) => p.id === id);
  if (post) {
    post.is_moderated = true;
  }
  return delay(post);
}

export function deletePost(id: string): Promise<boolean> {
  const index = mockPosts.findIndex((p) => p.id === id);
  if (index !== -1) {
    mockPosts.splice(index, 1);
    return delay(true);
  }
  return delay(false);
}
