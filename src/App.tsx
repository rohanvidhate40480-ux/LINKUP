import { useState } from 'react';
import { EventProvider } from './context/EventContext';
import { EventList } from './components/EventList';
import { CreateEvent } from './components/CreateEvent';
import { EventDetail } from './components/EventDetail';
import type { View } from './types/event';
import type { Event } from './types/event';
import './App.css';

function AppContent() {
  const [view, setView] = useState<View>('list');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  function handleViewDetail(eventId: string) {
    setSelectedEventId(eventId);
    setView('detail');
  }

  function handleCreated(event: Event) {
    setSelectedEventId(event.id);
    setView('detail');
  }

  return (
    <div className="app">
      <header className="app-header">
        <button
          className="app-logo"
          onClick={() => setView('list')}
          aria-label="Go to home"
        >
          <span className="app-logo__icon">⬡</span>
          <span className="app-logo__text">LINKUP</span>
        </button>
        <p className="app-tagline">Find your people. Join the pool.</p>
      </header>

      <main className="app-main">
        {view === 'list' && (
          <EventList
            onViewDetail={handleViewDetail}
            onCreateNew={() => setView('create')}
          />
        )}
        {view === 'create' && (
          <CreateEvent
            onCreated={handleCreated}
            onCancel={() => setView('list')}
          />
        )}
        {view === 'detail' && selectedEventId && (
          <EventDetail
            eventId={selectedEventId}
            onBack={() => setView('list')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>LINKUP · Connect through shared events</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}

export default App;
