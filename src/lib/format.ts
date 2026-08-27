export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'a l\'instant';
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return formatDate(iso);
}

export function formatNumber(n: number): string {
  return n.toLocaleString('fr-FR');
}

export function formatCurrency(n: number, currency = 'USD'): string {
  return n.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 2 });
}

export function formatPercent(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export const CHART_COLORS = {
  rose: '#C4857A',
  gold: '#C9A96E',
  brown: '#5C3D2E',
  green: '#5CA87E',
  muted: '#9E8A7E',
  danger: '#D67768',
  cream: '#F8F1EC',
  gray300: '#C7D1D9',
  gray200: '#E2E8EE',
} as const;
