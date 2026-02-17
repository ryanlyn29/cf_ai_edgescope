'use client';

/**
 * Dashboard Page (Root)
 * Main simulation dashboard with traffic visualization
 */

import { useAppStore } from '@/store/appStore';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
  const { isSimulating } = useAppStore();

  return <DashboardContent isSimulating={isSimulating} />;
}
