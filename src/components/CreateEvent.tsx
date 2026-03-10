import { useState, type FormEvent } from 'react';
import { useEvents } from '../context/useEvents';
import type { EventCategory, Event } from '../types/event';
import './CreateEvent.css';

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
  onCreated: (event: Event) => void;
  onCancel: () => void;
}

export function CreateEvent({ onCreated, onCancel }: Props) {
  const { createEvent } = useEvents();

  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('Social');
  const [maxParticipants, setMaxParticipants] = useState<number>(10);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required.';
    else if (title.trim().length < 3) errs.title = 'Title must be at least 3 characters.';

    if (!description.trim()) errs.description = 'Description is required.';

    if (!date) {
      errs.date = 'Date is required.';
    } else if (date < today) {
      errs.date = 'Event date cannot be in the past.';
    }

    if (!time) errs.time = 'Time is required.';
    else if (date === today) {
      const nowTime = new Date().toTimeString().slice(0, 5);
      if (time < nowTime) errs.time = 'Event time cannot be in the past for today.';
    }

    if (!location.trim()) errs.location = 'Location is required.';

    if (!maxParticipants || maxParticipants < 2) {
      errs.maxParticipants = 'At least 2 participants required.';
    } else if (maxParticipants > 500) {
      errs.maxParticipants = 'Maximum 500 participants allowed.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const event = createEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: location.trim(),
      category,
      maxParticipants,
    });

    onCreated(event);
  }

  return (
    <div className="create-event">
      <div className="create-event__header">
        <button
          className="create-event__back"
          onClick={onCancel}
          aria-label="Go back"
        >
          ← Back
        </button>
        <h2>Create New Event</h2>
      </div>

      <form className="create-event__form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="event-title">Event Title *</label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your event a catchy title"
            className={errors.title ? 'input-error' : ''}
            maxLength={100}
          />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="event-description">Description *</label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's the event about? Who should join?"
            rows={4}
            className={errors.description ? 'input-error' : ''}
            maxLength={500}
          />
          <span className="char-count">{description.length}/500</span>
          {errors.description && (
            <span className="error-msg">{errors.description}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event-date">Date *</label>
            <input
              id="event-date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="event-time">Time *</label>
            <input
              id="event-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={errors.time ? 'input-error' : ''}
            />
            {errors.time && <span className="error-msg">{errors.time}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="event-location">Location *</label>
          <input
            id="event-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where will it take place?"
            className={errors.location ? 'input-error' : ''}
            maxLength={200}
          />
          {errors.location && (
            <span className="error-msg">{errors.location}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event-category">Category</label>
            <select
              id="event-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="event-max">Max Participants *</label>
            <input
              id="event-max"
              type="number"
              value={maxParticipants}
              min={2}
              max={500}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              className={errors.maxParticipants ? 'input-error' : ''}
            />
            {errors.maxParticipants && (
              <span className="error-msg">{errors.maxParticipants}</span>
            )}
          </div>
        </div>

        <div className="create-event__actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create &amp; Join Pool
          </button>
        </div>
      </form>
    </div>
  );
}
