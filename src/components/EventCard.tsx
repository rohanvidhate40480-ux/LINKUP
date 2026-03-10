import type { Event } from '../types/event';
import { useEvents } from '../context/useEvents';
import './EventCard.css';

interface Props {
  event: Event;
  onViewDetail: (eventId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Social: '#f59e0b',
  Sports: '#10b981',
  Study: '#3b82f6',
  Music: '#8b5cf6',
  'Food & Drink': '#ef4444',
  Tech: '#06b6d4',
  Outdoor: '#22c55e',
  Other: '#6b7280',
};

export function EventCard({ event, onViewDetail }: Props) {
  const { joinEvent, leaveEvent, isJoined, isFull } = useEvents();

  const joined = isJoined(event.id);
  const full = isFull(event.id);
  const spotsLeft = event.maxParticipants - event.participants.length;

  const formattedDate = new Date(`${event.date}T${event.time}`).toLocaleString(
    'en-US',
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  );

  function handleJoinToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (joined) {
      leaveEvent(event.id);
    } else {
      joinEvent(event.id);
    }
  }

  const badgeColor = CATEGORY_COLORS[event.category] ?? '#6b7280';

  return (
    <article
      className="event-card"
      onClick={() => onViewDetail(event.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetail(event.id)}
      aria-label={`View details for ${event.title}`}
    >
      <header className="event-card__header">
        <span
          className="event-card__category"
          style={{ backgroundColor: badgeColor }}
        >
          {event.category}
        </span>
        {full && !joined && (
          <span className="event-card__full-badge">Full</span>
        )}
      </header>

      <h3 className="event-card__title">{event.title}</h3>

      <p className="event-card__description">
        {event.description.length > 100
          ? event.description.slice(0, 100) + '…'
          : event.description}
      </p>

      <div className="event-card__meta">
        <span className="event-card__meta-item">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
              clipRule="evenodd"
            />
          </svg>
          {formattedDate}
        </span>
        <span className="event-card__meta-item">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {event.location}
        </span>
      </div>

      <footer className="event-card__footer">
        <div className="event-card__participants">
          <div className="event-card__avatars">
            {event.participants.slice(0, 4).map((p) => (
              <span
                key={p.id}
                className="event-card__avatar"
                title={p.name}
                aria-label={p.name}
              >
                {p.avatarInitials}
              </span>
            ))}
            {event.participants.length > 4 && (
              <span className="event-card__avatar event-card__avatar--more">
                +{event.participants.length - 4}
              </span>
            )}
          </div>
          <span className="event-card__spots">
            {event.participants.length}/{event.maxParticipants}
            {spotsLeft > 0 && (
              <span className="event-card__spots-left">
                {' '}· {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
              </span>
            )}
          </span>
        </div>

        <button
          className={`event-card__btn ${joined ? 'event-card__btn--leave' : full ? 'event-card__btn--disabled' : 'event-card__btn--join'}`}
          onClick={handleJoinToggle}
          disabled={full && !joined}
          aria-label={joined ? `Leave ${event.title}` : `Join ${event.title}`}
        >
          {joined ? 'Leave Pool' : full ? 'Full' : 'Join Pool'}
        </button>
      </footer>
    </article>
  );
}
