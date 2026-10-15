export type SupportTopic = 'abonnement' | 'documents' | 'parcours' | 'bug' | 'autre';

export type SupportStatus = 'waiting' | 'answered' | 'resolved';

export type SupportMessageAuthor = 'user' | 'team' | 'event';

export interface SupportStats {
  waiting: number;
  answered: number;
  resolved: number;
  unread: number;
}

export interface SupportTicketContext {
  appVersion?: string;
  buildNumber?: string;
  platform?: string;
  osVersion?: string;
  locale?: string;
}

export interface SupportTicketUser {
  id: string;
  name: string;
  parcoursType: string | null;
}

export interface SupportTicket {
  id: string;
  topic: SupportTopic | string;
  subject: string;
  status: SupportStatus;
  unread: boolean;
  lastMessagePreview: string;
  createdAt: string;
  lastMessageAt: string;
  resolvedAt: string | null;
  context: SupportTicketContext;
  user: SupportTicketUser | null;
}

export interface SupportMessage {
  id: string;
  author: SupportMessageAuthor;
  authorName: string | null;
  body: string;
  attachmentUrl: string | null;
  createdAt: string;
}

export interface SupportTicketDetail {
  ticket: SupportTicket;
  messages: SupportMessage[];
  user: (SupportTicketUser & { email: string | null }) | null;
}

export const SUPPORT_TOPIC_LABELS: Record<SupportTopic, string> = {
  abonnement: 'Abonnement',
  documents: 'Documents',
  parcours: 'Parcours',
  bug: 'Bug',
  autre: 'Autre',
};

export const SUPPORT_STATUS_LABELS: Record<SupportStatus, string> = {
  waiting: 'À traiter',
  answered: 'Répondu',
  resolved: 'Résolu',
};

export const SUPPORT_STATUS_BADGE_VARIANTS: Record<SupportStatus, 'rose' | 'gold' | 'green'> = {
  waiting: 'rose',
  answered: 'gold',
  resolved: 'green',
};

export const PARCOURS_LABELS: Record<string, string> = {
  retourEmploi: "Retour à l'emploi",
  reconversion: 'Reconversion',
  creationActivite: "Création d'activité",
  coaching: 'Coaching',
};

export const SUPPORT_EVENT_LABELS: Record<string, string> = {
  resolved_by_team: "L'équipe a marqué la demande comme résolue",
  resolved_by_user: "L'utilisatrice a marqué la demande comme résolue",
  reopened: 'La demande a été rouverte',
};

export function topicLabel(topic: string): string {
  return SUPPORT_TOPIC_LABELS[topic as SupportTopic] ?? topic;
}

export function parcoursLabel(parcoursType: string | null | undefined): string {
  if (!parcoursType) return '—';
  return PARCOURS_LABELS[parcoursType] ?? parcoursType;
}

export function eventLabel(code: string): string {
  return SUPPORT_EVENT_LABELS[code] ?? code;
}
