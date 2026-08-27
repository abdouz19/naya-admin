import { useCallback, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { Card, Spinner, Stat } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import { getAiUsage } from '@/services/ai-usage.service';
import { getAiStats, type AiStats } from '@/services/ai-usage.service';
import type { AiCallLog, AiEndpointType } from '@/types/ai-usage';
import { AI_ENDPOINT_LABELS, AI_CATEGORIES } from '@/types/ai-usage';
import { formatNumber } from '@/lib/format';
import { AiCostTracker } from './AiCostTracker';
import { AiUsageTimeline } from './AiUsageTimeline';
import { AiEndpointCard } from './AiEndpointCard';

export default function AiUsagePage() {
  const logsFn = useCallback(() => getAiUsage(), []);
  const statsFn = useCallback(() => getAiStats(), []);

  const { data: logs, loading: loadingLogs } = useService<AiCallLog[]>(logsFn);
  const { data: stats, loading: loadingStats } = useService<AiStats>(statsFn);

  const loading = loadingLogs || loadingStats;

  // Count today's calls
  const todayCalls = useMemo(() => {
    if (!logs) return 0;
    const today = new Date().toISOString().slice(0, 10);
    return logs.filter((l) => l.timestamp.slice(0, 10) === today).length;
  }, [logs]);

  // Compute avg tokens and avg duration per endpoint
  const endpointMetrics = useMemo(() => {
    if (!logs) return {} as Record<AiEndpointType, { avgTokens: number; avgDuration: number }>;
    const acc: Record<string, { totalTokens: number; totalDuration: number; count: number }> = {};
    for (const log of logs) {
      if (!acc[log.endpoint]) {
        acc[log.endpoint] = { totalTokens: 0, totalDuration: 0, count: 0 };
      }
      acc[log.endpoint].totalTokens += log.tokens_input + log.tokens_output;
      acc[log.endpoint].totalDuration += log.duration_ms;
      acc[log.endpoint].count += 1;
    }
    const result: Record<string, { avgTokens: number; avgDuration: number }> = {};
    for (const [key, val] of Object.entries(acc)) {
      result[key] = {
        avgTokens: val.totalTokens / val.count,
        avgDuration: val.totalDuration / val.count,
      };
    }
    return result as Record<AiEndpointType, { avgTokens: number; avgDuration: number }>;
  }, [logs]);

  // Last 30 days of timeline data
  const timelineData = useMemo(() => {
    if (!stats?.callsByDay) return [];
    return stats.callsByDay.slice(-30);
  }, [stats]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top: Cost + Today stat */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <AiCostTracker
          totalCost={stats?.totalCost ?? 0}
          totalCalls={stats?.totalCalls ?? 0}
        />
        <Card className="p-6">
          <Stat
            label="Appels aujourd'hui"
            value={formatNumber(todayCalls)}
            icon={Zap}
          />
        </Card>
      </div>

      {/* Timeline chart */}
      {timelineData.length > 0 && <AiUsageTimeline data={timelineData} />}

      {/* By endpoint, grouped by category */}
      <div className="space-y-6">
        <h2 className="font-heading text-lg font-semibold text-brown">
          Par endpoint
        </h2>

        {Object.entries(AI_CATEGORIES).map(([category, endpoints]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wide">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {endpoints.map((ep) => (
                <AiEndpointCard
                  key={ep}
                  endpoint={ep}
                  label={AI_ENDPOINT_LABELS[ep]}
                  count={stats?.callsByEndpoint[ep] ?? 0}
                  avgTokens={endpointMetrics[ep]?.avgTokens ?? 0}
                  avgDuration={endpointMetrics[ep]?.avgDuration ?? 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
