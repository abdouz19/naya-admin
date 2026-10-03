import { mockAdminUsers, mockRolePermissions } from '@/data/mock-admins';
import type { AdminRole, AdminUser, RolePermissions } from '@/types/admin';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let users = [...mockAdminUsers];
let permissions = mockRolePermissions.map((rp) => ({
  ...rp,
  permissions: { ...rp.permissions },
}));

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin-settings/users`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        users = data;
        return data;
      }
    }
  } catch (_) {
    // fallback
  }
  return [...users];
}

export async function getRolePermissions(): Promise<RolePermissions[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin-settings/permissions`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        permissions = data;
        return data;
      }
    }
  } catch (_) {
    // fallback
  }
  return permissions.map((rp) => ({ ...rp, permissions: { ...rp.permissions } }));
}

export async function addAdminUser(
  data: Omit<AdminUser, 'id' | 'created_at' | 'last_login_at'>,
): Promise<AdminUser> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin-settings/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const created = await res.json();
      users = [...users, created];
      return created;
    }
  } catch (_) {
    // fallback
  }

  const newUser: AdminUser = {
    ...data,
    id: `adm_${String(users.length + 1).padStart(3, '0')}`,
    created_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };
  users = [...users, newUser];
  return newUser;
}

export async function updateAdminUser(
  id: string,
  updates: Partial<Omit<AdminUser, 'id'>>,
): Promise<AdminUser | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin-settings/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      const idx = users.findIndex((u) => u.id === id);
      if (idx !== -1) users[idx] = updated;
      return updated;
    }
  } catch (_) {
    // fallback
  }

  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates };
  return { ...users[idx] };
}

export async function deleteAdminUser(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/admin-settings/users/${id}`, {
      method: 'DELETE',
    });
  } catch (_) {
    // fallback
  }
  users = users.filter((u) => u.id !== id);
}

export async function updateRolePermissions(
  role: AdminRole,
  updated: RolePermissions['permissions'],
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/admin-settings/permissions/${role}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissions: updated }),
    });
  } catch (_) {
    // fallback
  }

  permissions = permissions.map((rp) =>
    rp.role === role ? { ...rp, permissions: { ...updated } } : rp,
  );
}
