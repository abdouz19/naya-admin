import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import DashboardPage from '@/features/dashboard/DashboardPage';
import UsersPage from '@/features/users/UsersPage';
import CandidaturesPage from '@/features/candidatures/CandidaturesPage';
import AiUsagePage from '@/features/ai-usage/AiUsagePage';
import AteliersPage from '@/features/ateliers/AteliersPage';
import CommunityPage from '@/features/community/CommunityPage';
import SubscriptionsPage from '@/features/subscriptions/SubscriptionsPage';
import SettingsPage from '@/features/settings/SettingsPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'utilisatrices', element: <UsersPage /> },
      { path: 'candidatures', element: <CandidaturesPage /> },
      { path: 'ia', element: <AiUsagePage /> },
      { path: 'ateliers', element: <AteliersPage /> },
      { path: 'communaute', element: <CommunityPage /> },
      { path: 'abonnements', element: <SubscriptionsPage /> },
      { path: 'reglages', element: <SettingsPage /> },
    ],
  },
]);
