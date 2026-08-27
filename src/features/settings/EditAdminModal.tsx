import { type FormEvent, useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from '@/components/ui';
import type { AdminRole, AdminUser } from '@/types/admin';
import { ROLE_LABELS } from '@/types/admin';

interface EditAdminModalProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<AdminUser>) => void;
}

const roleOptions = (Object.entries(ROLE_LABELS) as [AdminRole, string][]).map(
  ([value, label]) => ({ value, label }),
);

export function EditAdminModal({ open, user, onClose, onSave }: EditAdminModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('viewer');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setIsActive(user.is_active);
    }
  }, [user]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user || !name.trim() || !email.trim()) return;
    onSave(user.id, {
      name: name.trim(),
      email: email.trim(),
      role,
      is_active: isActive,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier le membre">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Prénom Nom"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@nayha.fr"
          required
        />
        <Select
          label="Rôle"
          options={roleOptions}
          value={role}
          onChange={(e) => setRole(e.target.value as AdminRole)}
        />

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <label htmlFor="is-active-toggle" className="text-sm font-medium text-muted">
            Compte actif
          </label>
          <button
            id="is-active-toggle"
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => setIsActive((v) => !v)}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
              transition-colors duration-200
              ${isActive ? 'bg-rose' : 'bg-gray-300'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
                ${isActive ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Modal>
  );
}
