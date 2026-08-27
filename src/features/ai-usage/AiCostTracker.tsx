import { DollarSign } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/lib/format';

interface AiCostTrackerProps {
  totalCost: number;
  totalCalls: number;
}

export function AiCostTracker({ totalCost, totalCalls }: AiCostTrackerProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center radius-sm bg-rose-light/30 text-rose">
          <DollarSign size={20} />
        </div>
        <div>
          <p className="text-sm text-muted">Cout estime</p>
          <p className="mt-1 text-3xl font-semibold text-brown">
            {formatCurrency(totalCost)}
          </p>
          <p className="mt-1 text-sm text-muted">
            {formatNumber(totalCalls)} appels au total
          </p>
        </div>
      </div>
    </Card>
  );
}
