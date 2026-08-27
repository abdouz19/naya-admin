import { mockAdminUsers, mockRolePermissions } from '@/data/mock-admins';
import type { AdminRole, AdminUser, RolePermissions } from '@/types/admin';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

let users = [...mockAdminUsers];
let permissions = mockRolePermissions.map((rp) => ({
  ...rp,
  permissions: { ...rp.permissions },
}));

export function getAdminUsers(): Promise<AdminUser[]> {
  return delay([...users]);
}

export function getRolePermissions(): Promise<RolePermissions[]> {
  return delay(
    permissions.map((rp) => ({ ...rp, permissions: { ...rp.permissions } })),
  );
}

export function addAdminUser(
  data: Omit<AdminUser, 'id' | 'created_at' | 'last_login_at'>,
): Promise<AdminUser> {
  const newUser: AdminUser = {
    ...data,
    id: `adm_${String(users.length + 1).padStart(3, '0')}`,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };
  users = [...users, newUser];
  return delay(newUser);
}

export function updateAdminUser(
  id: string,
  updates: Partial<Omit<AdminUser, 'id'>>,
): Promise<AdminUser | undefined> {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return delay(undefined);
  users[idx] = { ...users[idx], ...updates };
  return delay({ ...users[idx] });
}

export function deleteAdminUser(id: string): Promise<void> {
  users = users.filter((u) => u.id !== id);
  return delay(undefined as unknown as void);
}

export function updateRolePermissions(
  role: AdminRole,
  updated: RolePermissions['permissions'],
): Promise<void> {
  permissions = permissions.map((rp) =>
    rp.role === role ? { ...rp, permissions: { ...updated } } : rp,
  );
  return delay(undefined as unknown as void);
}
