import { mockUsers } from '@/data/mock-users';
import type { UserProfile } from '@/types/user';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export function getUsers(): Promise<UserProfile[]> {
  return delay([...mockUsers]);
}

export function getUserById(id: string): Promise<UserProfile | undefined> {
  return delay(mockUsers.find((u) => u.id === id));
}

export interface UserStats {
  total: number;
  activeThisWeek: number;
  paidUsers: number;
  diagnosticCompleted: number;
}

export function getUserStats(): Promise<UserStats> {
  const now = new Date('2026-08-26T12:00:00Z').getTime();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const total = mockUsers.length;
  const activeThisWeek = mockUsers.filter(
    (u) => now - new Date(u.last_active_at).getTime() < oneWeekMs
  ).length;
  const paidUsers = mockUsers.filter((u) => u.has_paid).length;
  const diagnosticCompleted = mockUsers.filter(
    (u) => u.diagnostic_vie_completed && u.diagnostic_pro_completed
  ).length;

  return delay({ total, activeThisWeek, paidUsers, diagnosticCompleted });
}

export function blockUser(id: string): Promise<UserProfile | undefined> {
  const user = mockUsers.find((u) => u.id === id);
  if (user) (user as any).is_blocked = true;
  return delay(user);
}

export function unblockUser(id: string): Promise<UserProfile | undefined> {
  const user = mockUsers.find((u) => u.id === id);
  if (user) (user as any).is_blocked = false;
  return delay(user);
}
