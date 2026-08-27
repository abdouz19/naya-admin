import { type FormEvent, useState } from 'react';
import { Button, Input, Modal, Select } from '@/components/ui';
import type { AdminRole } from '@/types/admin';
import { ROLE_LABELS } from '@/types/admin';

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; email: string; role: AdminRole }) => void;
}

const roleOptions = (Object.entries(ROLE_LABELS) as [AdminRole, string][]).map(
  ([value, label]) => ({ value, label }),
);

export function AddAdminModal({ open, onClose, onSave }: AddAdminModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('viewer');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ name: name.trim(), email: email.trim(), role });
    setName('');
    setEmail('');
    setRole('viewer');
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Ajouter un membre">
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
