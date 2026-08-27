import { Brain } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatNumber } from '@/lib/format';

interface AiEndpointCardProps {
  endpoint: string;
  label: string;
  count: number;
  avgTokens: number;
  avgDuration: number;
}

export function AiEndpointCard({
  label,
  count,
  avgTokens,
  avgDuration,
}: AiEndpointCardProps) {
  return (
    <Card className="flex items-start gap-3 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center radius-sm bg-rose-light/30 text-rose">
        <Brain size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-brown truncate">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-brown">
          {formatNumber(count)}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted">
          <span>{formatNumber(Math.round(avgTokens))} tokens/appel</span>
          <span>{Math.round(avgDuration)}ms moy.</span>
        </div>
      </div>
    </Card>
  );
}
