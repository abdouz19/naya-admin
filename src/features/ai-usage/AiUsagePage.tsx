import { Brain } from 'lucide-react';
import { Card, EmptyState } from '@/components/ui';

export default function AiUsagePage() {
  return (
    <div className="space-y-6">
      <Card>
        <EmptyState
          icon={Brain}
          title="Métriques IA"
          description="L'enregistrement détaillé des tokens et des coûts OpenAI sera activé prochainement sur le serveur. Aucun appel simulé n'est affiché."
        />
      </Card>
    </div>
  );
}

