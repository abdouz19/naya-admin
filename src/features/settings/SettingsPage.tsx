import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button, Modal, Table, Tabs } from '@/components/ui';
import type { AdminRole, AdminUser, RolePermissions } from '@/types/admin';
import {
  getAdminUsers,
  getRolePermissions,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateRolePermissions,
} from '@/services/admin.service';
import { AdminUserRow } from './AdminUserRow';
import { AddAdminModal } from './AddAdminModal';
import { EditAdminModal } from './EditAdminModal';
import { RolePermissionsCard } from './RolePermissionsCard';

const TABS = [
  { key: 'team', label: 'Équipe' },
  { key: 'roles', label: 'Rôles & Permissions' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('team');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [permissions, setPermissions] = useState<RolePermissions[]>([]);

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    getAdminUsers().then(setUsers);
    getRolePermissions().then(setPermissions);
  }, []);

  async function handleAdd(data: { name: string; email: string; role: AdminRole }) {
    const newUser = await addAdminUser({
      ...data,
      avatar_url: null,
      is_active: true,
    });
    setUsers((prev) => [...prev, newUser]);
  }

  async function handleEdit(id: string, updates: Partial<AdminUser>) {
    const updated = await updateAdminUser(id, updates);
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteAdminUser(deleteTarget.id);
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  async function handleUpdatePermissions(
    role: AdminRole,
    perms: RolePermissions['permissions'],
  ) {
    await updateRolePermissions(role, perms);
    setPermissions((prev) =>
      prev.map((rp) => (rp.role === role ? { ...rp, permissions: perms } : rp)),
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-brown">Réglages</h1>
        <p className="mt-1 text-sm text-muted">
          Gestion de l'équipe et des permissions d'administration
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={TABS.map((t) =>
          t.key === 'team' ? { ...t, count: users.length } : t,
        )}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      {/* Team tab */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {users.length} membre{users.length > 1 ? 's' : ''} dans l'équipe
            </p>
            <Button
              icon={<UserPlus size={16} />}
              onClick={() => setAddModalOpen(true)}
            >
              Ajouter un membre
            </Button>
          </div>

          {/* Users table */}
          <Table>
            <Table.Header>
              <th className="px-4 py-3 text-left">Membre</th>
              <th className="px-4 py-3 text-left">Rôle</th>
              <th className="px-4 py-3 text-left">Dernier login</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <AdminUserRow
                  key={user.id}
                  user={user}
                  onEdit={setEditUser}
                  onDelete={setDeleteTarget}
                />
              ))}
            </Table.Body>
          </Table>

          {/* Add modal */}
          <AddAdminModal
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSave={handleAdd}
          />

          {/* Edit modal */}
          <EditAdminModal
            open={editUser !== null}
            user={editUser}
            onClose={() => setEditUser(null)}
            onSave={handleEdit}
          />

          {/* Delete confirmation modal */}
          <Modal
            open={deleteTarget !== null}
            onClose={() => setDeleteTarget(null)}
            title="Confirmer la suppression"
          >
            <p className="text-sm text-muted">
              Voulez-vous vraiment supprimer{' '}
              <span className="font-medium text-brown">{deleteTarget?.name}</span> de
              l'équipe ? Cette action est irréversible.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Supprimer
              </Button>
            </div>
          </Modal>
        </div>
      )}

      {/* Roles & Permissions tab */}
      {activeTab === 'roles' && permissions.length > 0 && (
        <RolePermissionsCard
          permissions={permissions}
          onUpdate={handleUpdatePermissions}
        />
      )}
    </div>
  );
}
