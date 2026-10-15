import { useState, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui';

interface SupportComposerProps {
  isResolved: boolean;
  sending: boolean;
  onSend: (message: string) => Promise<boolean>;
}

export function SupportComposer({ isResolved, sending, onSend }: SupportComposerProps) {
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0 && !sending;

  async function submit() {
    if (!canSend) return;
    const ok = await onSend(draft.trim());
    if (ok) setDraft('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      {isResolved && (
        <p className="mb-2 text-xs text-muted">Répondre rouvrira la demande.</p>
      )}
      <div className="flex items-end gap-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Écrire une réponse…"
          className="flex-1 resize-none radius-sm border border-gray-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted-light outline-none transition-colors focus:border-rose focus:ring-2 focus:ring-rose/20"
        />
        <Button
          onClick={() => void submit()}
          disabled={!canSend}
          loading={sending}
          icon={<Send size={16} />}
        >
          Envoyer
        </Button>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-light">
        Ctrl/⌘ + Entrée pour envoyer
      </p>
    </div>
  );
}
