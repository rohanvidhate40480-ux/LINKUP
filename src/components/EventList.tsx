import { useState, useMemo } from 'react';
import { useEvents } from '../context/useEvents';
import { EventCard } from './EventCard';
import type { EventCategory } from '../types/event';
import './EventList.css';

const CATEGORIES: EventCategory[] = [
  'Social',
  'Sports',
  'Study',
  'Music',
  'Food & Drink',
  'Tech',
  'Outdoor',
  'Other',
];

interface Props {
  onViewDetail: (eventId: string) => void;
  onCreateNew: () => void;
}

export function EventList({ onViewDetail, onCreateNew }: Props) {
  const { events } = useEvents();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const { isJoined } = useEvents();

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        search.trim() === '' ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;

      const matchesJoined = !showJoinedOnly || isJoined(event.id);

      return matchesSearch && matchesCategory && matchesJoined;
    });
  }, [events, search, selectedCategory, showJoinedOnly, isJoined]);

  return (
    <div className="event-list">
      <div className="event-list__toolbar">
        <div className="event-list__search-wrap">
          <svg
            className="event-list__search-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="event-list__search"
            type="search"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search events"
          />
        </div>

        <button className="btn-primary" onClick={onCreateNew} aria-label="Create new event">
          + Create Event
        </button>
      </div>

      <div className="event-list__filters">
        <button
          className={`filter-chip ${selectedCategory === 'All' ? 'filter-chip--active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'filter-chip--active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <label className="filter-chip filter-chip--toggle">
          <input
            type="checkbox"
            checked={showJoinedOnly}
            onChange={(e) => setShowJoinedOnly(e.target.checked)}
          />
          My Events
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="event-list__empty">
          <p>No events found.</p>
          {search || selectedCategory !== 'All' ? (
            <button
              className="btn-secondary"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setShowJoinedOnly(false);
              }}
            >
              Clear filters
            </button>
          ) : (
            <button className="btn-primary" onClick={onCreateNew}>
              Create the first event
            </button>
          )}
        </div>
      ) : (
        <div className="event-list__grid">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
