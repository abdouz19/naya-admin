import { mockAiUsage } from '@/data/mock-ai-usage';
import type { AiCallLog, AiEndpointType } from '@/types/ai-usage';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export function getAiUsage(): Promise<AiCallLog[]> {
  return delay([...mockAiUsage]);
}

export interface AiStats {
  totalCalls: number;
  totalCost: number;
  callsByEndpoint: Record<AiEndpointType, number>;
  callsByDay: { date: string; count: number; cost: number }[];
}

export function getAiStats(): Promise<AiStats> {
  const totalCalls = mockAiUsage.length;
  const totalCost = mockAiUsage.reduce((sum, log) => sum + log.cost_usd, 0);

  const callsByEndpoint = {} as Record<AiEndpointType, number>;
  for (const log of mockAiUsage) {
    callsByEndpoint[log.endpoint] = (callsByEndpoint[log.endpoint] || 0) + 1;
  }

  const dayMap = new Map<string, { count: number; cost: number }>();
  for (const log of mockAiUsage) {
    const date = log.timestamp.slice(0, 10);
    const existing = dayMap.get(date) || { count: 0, cost: 0 };
    existing.count += 1;
    existing.cost += log.cost_usd;
    dayMap.set(date, existing);
  }

  const callsByDay = Array.from(dayMap.entries())
    .map(([date, data]) => ({ date, count: data.count, cost: Math.round(data.cost * 10000) / 10000 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return delay({ totalCalls, totalCost: Math.round(totalCost * 100) / 100, callsByEndpoint, callsByDay });
}
