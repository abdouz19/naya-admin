import { mockUsers } from '@/data/mock-users';
import type { UserProfile } from '@/types/user';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryUsers = [...mockUsers];

export async function getUsers(): Promise<UserProfile[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/users/admin/all`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        inMemoryUsers = data;
        return data;
      }
    }
  } catch (_) {
    // fallback
  }
  return [...inMemoryUsers];
}

export async function getUserById(id: string): Promise<UserProfile | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/users/admin/${id}`);
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
    const res = await fetch(`${API_BASE_URL}/users/admin/stats`);
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
    const res = await fetch(`${API_BASE_URL}/users/admin/${id}/block`, {
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
    const res = await fetch(`${API_BASE_URL}/users/admin/${id}/block`, {
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
