import type { AiCallLog, AiEndpointType } from '@/types/ai-usage';

// Weighted endpoints: portrait and plan-action heaviest, simulation and bilan lightest
const ENDPOINT_WEIGHTS: { endpoint: AiEndpointType; weight: number }[] = [
  { endpoint: 'portrait', weight: 25 },
  { endpoint: 'plan-action', weight: 22 },
  { endpoint: 'evaluate', weight: 18 },
  { endpoint: 'analyse-offres', weight: 20 },
  { endpoint: 'cv-adapte', weight: 18 },
  { endpoint: 'cv-metier', weight: 15 },
  { endpoint: 'lettre-motivation', weight: 20 },
  { endpoint: 'relance', weight: 15 },
  { endpoint: 'bilan-mensuel', weight: 6 },
  { endpoint: 'entretien-debrief', weight: 10 },
  { endpoint: 'simulation-entretien', weight: 12 },
  { endpoint: 'simulation-feedback', weight: 10 },
  { endpoint: 'simulation-score', weight: 8 },
  { endpoint: 'linkedin-profile', weight: 14 },
  { endpoint: 'proposition-embauche', weight: 5 },
  { endpoint: 'parcours-reussite', weight: 4 },
];

// Active user IDs (those who have used AI features)
const ACTIVE_USERS = ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u25'];

// Seeded random for reproducibility
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateAiLogs(): AiCallLog[] {
  const rand = seededRandom(42);
  const logs: AiCallLog[] = [];

  // Build weighted endpoint pool
  const pool: AiEndpointType[] = [];
  for (const { endpoint, weight } of ENDPOINT_WEIGHTS) {
    for (let i = 0; i < weight; i++) pool.push(endpoint);
  }

  // Generate 250 logs over the last 30 days
  const now = new Date('2026-08-26T12:00:00Z').getTime();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 250; i++) {
    const endpoint = pool[Math.floor(rand() * pool.length)];
    const userId = ACTIVE_USERS[Math.floor(rand() * ACTIVE_USERS.length)];
    const timestampMs = now - Math.floor(rand() * thirtyDaysMs);
    const timestamp = new Date(timestampMs).toISOString();

    const tokensInput = 500 + Math.floor(rand() * 2500);
    const tokensOutput = 200 + Math.floor(rand() * 1800);
    const costUsd = (tokensInput / 1000) * 0.003 + (tokensOutput / 1000) * 0.015;
    const durationMs = 1500 + Math.floor(rand() * 6500);

    logs.push({
      id: `ai${i + 1}`,
      user_id: userId,
      endpoint,
      timestamp,
      tokens_input: tokensInput,
      tokens_output: tokensOutput,
      cost_usd: Math.round(costUsd * 10000) / 10000,
      duration_ms: durationMs,
    });
  }

  // Sort by timestamp descending
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return logs;
}

export const mockAiUsage: AiCallLog[] = generateAiLogs();
