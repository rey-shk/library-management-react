import React, { useState } from 'react';
import './App.css';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { BooksView } from './components/books/BooksView';
import { CirculationView } from './components/circulation/CirculationView';
import { MembersView } from './components/members/MembersView';
import { ReservationsView } from './components/reservations/ReservationsView';
import { FinesView } from './components/fines/FinesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useLibrary();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'books':
        return <BooksView />;
      case 'circulation':
        return <CirculationView />;
      case 'members':
        return <MembersView />;
      case 'reservations':
        return <ReservationsView />;
      case 'fines':
        return <FinesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 35, background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Container */}
      <div className="app-main">
        <Header setMobileOpen={setMobileOpen} />
        <main style={{ flex: 1 }}>{renderActiveView()}</main>
      </div>

      {/* Global Overlays */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <LibraryProvider>
      <MainContent />
    </LibraryProvider>
  );
}

export default App;
