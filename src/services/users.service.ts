import { mockUsers } from '@/data/mock-users';
import type { UserProfile } from '@/types/user';
import { apiFetch } from '@/lib/api';
import { PAGE_SIZE, type Paginated } from '@/types/pagination';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryUsers = [...mockUsers];

export interface UserListFilters {
  search?: string;
  diagnostic?: 'all' | 'completed' | 'incomplete';
  plan?: 'all' | 'paid' | 'free';
  parcours?: string;
}

/** One page of users, searched and filtered by the API. */
export async function getUsersPage(
  page: number,
  filters: UserListFilters = {},
  pageSize = PAGE_SIZE,
): Promise<Paginated<UserProfile>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.diagnostic && filters.diagnostic !== 'all') {
    params.set('diagnostic', filters.diagnostic);
  }
  if (filters.plan && filters.plan !== 'all') params.set('plan', filters.plan);
  if (filters.parcours && filters.parcours !== 'all') {
    params.set('parcours', filters.parcours);
  }
  const res = await apiFetch(`${API_BASE_URL}/users/admin/all?${params}`);
  if (!res.ok) throw new Error('Les utilisatrices n’ont pas pu être chargées.');
  return res.json();
}

/** Every user matching the filters (CSV export, dashboard figures). */
export async function getUsers(
  filters: UserListFilters = {},
): Promise<UserProfile[]> {
  try {
    const all: UserProfile[] = [];
    for (let page = 1; page <= 100; page++) {
      const result = await getUsersPage(page, filters, 100);
      all.push(...result.items);
      if (all.length >= result.total || result.items.length === 0) break;
    }
    inMemoryUsers = all;
    return all;
  } catch (_) {
    return [...inMemoryUsers];
  }
}

export async function getUserById(id: string): Promise<UserProfile | undefined> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/users/admin/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) return data;
    }
  } catch (_) {
    // fallback
  }
  return inMemoryUsers.find((u) => u.id === id);
}

export interface UserStats {
  total: number;
  activeThisWeek: number;
  paidUsers: number;
  diagnosticCompleted: number;
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/users/admin/stats`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.total === 'number') return data;
    }
  } catch (_) {
    // fallback
  }

  const users = await getUsers();
  const now = Date.now();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const total = users.length;
  const activeThisWeek = users.filter(
    (u) => now - new Date(u.last_active_at).getTime() < oneWeekMs,
  ).length;
  const paidUsers = users.filter((u) => u.has_paid).length;
  const diagnosticCompleted = users.filter(
    (u) => u.diagnostic_vie_completed && u.diagnostic_pro_completed,
  ).length;

  return { total, activeThisWeek, paidUsers, diagnosticCompleted };
}

export async function blockUser(id: string): Promise<UserProfile | undefined> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/users/admin/${id}/block`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_blocked: true }),
    });
    if (res.ok) {
      const data = await res.json();
      const idx = inMemoryUsers.findIndex((u) => u.id === id);
      if (idx !== -1) inMemoryUsers[idx] = data;
      return data;
    }
  } catch (_) {
    // fallback
  }
  const user = inMemoryUsers.find((u) => u.id === id);
  if (user) (user as any).is_blocked = true;
  return user;
}

export async function unblockUser(id: string): Promise<UserProfile | undefined> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/users/admin/${id}/block`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_blocked: false }),
    });
    if (res.ok) {
      const data = await res.json();
      const idx = inMemoryUsers.findIndex((u) => u.id === id);
      if (idx !== -1) inMemoryUsers[idx] = data;
      return data;
    }
  } catch (_) {
    // fallback
  }
  const user = inMemoryUsers.find((u) => u.id === id);
  if (user) (user as any).is_blocked = false;
  return user;
}
