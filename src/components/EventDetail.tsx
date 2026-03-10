import { useEvents } from '../context/useEvents';
import './EventDetail.css';

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

interface Props {
  eventId: string;
  onBack: () => void;
}

export function EventDetail({ eventId, onBack }: Props) {
  const { events, joinEvent, leaveEvent, isJoined, isFull } = useEvents();

  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="event-detail event-detail--not-found">
        <p>Event not found.</p>
        <button className="btn-secondary" onClick={onBack}>
          ← Back to Events
        </button>
      </div>
    );
  }

  const joined = isJoined(event.id);
  const full = isFull(event.id);
  const spotsLeft = event.maxParticipants - event.participants.length;

  const formattedDate = new Date(`${event.date}T${event.time}`).toLocaleString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  );

  const badgeColor = CATEGORY_COLORS[event.category] ?? '#6b7280';

  const fillPercent = Math.round(
    (event.participants.length / event.maxParticipants) * 100
  );

  function handleJoinToggle() {
    if (joined) {
      leaveEvent(event!.id);
    } else {
      joinEvent(event!.id);
    }
  }

  return (
    <div className="event-detail">
      <button className="event-detail__back" onClick={onBack} aria-label="Back to event list">
        ← Back to Events
      </button>

      <div className="event-detail__card">
        <header className="event-detail__header">
          <span
            className="event-detail__category"
            style={{ backgroundColor: badgeColor }}
          >
            {event.category}
          </span>
          <h1 className="event-detail__title">{event.title}</h1>
          <p className="event-detail__created-by">
            Organized by <strong>{event.createdBy.name}</strong>
          </p>
        </header>

        <div className="event-detail__info-grid">
          <div className="event-detail__info-item">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <span className="event-detail__info-label">Date &amp; Time</span>
              <span className="event-detail__info-value">{formattedDate}</span>
            </div>
          </div>

          <div className="event-detail__info-item">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <span className="event-detail__info-label">Location</span>
              <span className="event-detail__info-value">{event.location}</span>
            </div>
          </div>
        </div>

        <section className="event-detail__description">
          <h2>About this event</h2>
          <p>{event.description}</p>
        </section>

        <section className="event-detail__pool">
          <h2>Event Pool</h2>
          <div className="event-detail__pool-stats">
            <span className="event-detail__pool-count">
              {event.participants.length}
              <span>/ {event.maxParticipants} joined</span>
            </span>
            {spotsLeft > 0 ? (
              <span className="event-detail__spots-left">
                {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
              </span>
            ) : (
              <span className="event-detail__spots-full">Pool is full</span>
            )}
          </div>

          <div
            className="event-detail__progress-bar"
            role="progressbar"
            aria-valuenow={event.participants.length}
            aria-valuemin={0}
            aria-valuemax={event.maxParticipants}
            aria-label="Pool capacity"
          >
            <div
              className="event-detail__progress-fill"
              style={{ width: `${fillPercent}%` }}
            />
          </div>

          <div className="event-detail__participants">
            {event.participants.map((p) => (
              <div key={p.id} className="event-detail__participant">
                <span
                  className={`event-detail__avatar ${p.id === 'current-user' ? 'event-detail__avatar--you' : ''}`}
                  aria-label={p.name}
                >
                  {p.avatarInitials}
                </span>
                <span className="event-detail__participant-name">
                  {p.id === 'current-user' ? 'You' : p.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="event-detail__actions">
          <button
            className={`event-detail__join-btn ${joined ? 'event-detail__join-btn--leave' : full ? 'event-detail__join-btn--disabled' : 'event-detail__join-btn--join'}`}
            onClick={handleJoinToggle}
            disabled={full && !joined}
          >
            {joined
              ? '✓ Leave Pool'
              : full
                ? 'Pool is Full'
                : '+ Join Pool'}
          </button>
          {joined && (
            <p className="event-detail__joined-msg">
              You are in this pool! See you there. 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
