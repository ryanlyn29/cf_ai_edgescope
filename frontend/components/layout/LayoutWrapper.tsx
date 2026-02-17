'use client';

/**
 * Layout Wrapper Component
 * Client component that wraps the layout with global simulation state
 */

import { useAppStore } from '@/store/appStore';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const {
    isSimulating,
    startSimulation,
    stopSimulation,
    resetSimulation,
    saveSimulation,
  } = useAppStore();

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
      saveSimulation();
    } else {
      startSimulation();
    }
  };

  const handleResetSimulation = () => {
    resetSimulation();
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isSimulating={isSimulating}
          onToggleSimulation={handleToggleSimulation}
          onResetSimulation={handleResetSimulation}
        />
        {children}
      </div>
    </div>
  );
}
