import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Event, Participant } from '../types/event';

const CURRENT_USER: Participant = {
  id: 'current-user',
  name: 'You',
  avatarInitials: 'YO',
};

const SAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Weekend Hiking Trip',
    description:
      'Join us for a scenic hike through the local nature reserve. All skill levels welcome. We will meet at the trailhead and explore together!',
    date: '2026-03-22',
    time: '08:00',
    location: 'Greenwood Nature Reserve, Trail Entrance',
    category: 'Outdoor',
    maxParticipants: 12,
    participants: [
      { id: 'u1', name: 'Alice Johnson', avatarInitials: 'AJ' },
      { id: 'u2', name: 'Bob Smith', avatarInitials: 'BS' },
      { id: 'u3', name: 'Carol Lee', avatarInitials: 'CL' },
    ],
    createdBy: { id: 'u1', name: 'Alice Johnson', avatarInitials: 'AJ' },
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Study Group: Web Dev',
    description:
      'Collaborative study session focused on React and TypeScript. Bring your laptop, questions, and snacks. We help each other level up!',
    date: '2026-03-18',
    time: '18:30',
    location: 'Central Library, Room 204',
    category: 'Study',
    maxParticipants: 8,
    participants: [
      { id: 'u4', name: 'David Kim', avatarInitials: 'DK' },
      { id: 'u5', name: 'Eva Patel', avatarInitials: 'EP' },
    ],
    createdBy: { id: 'u4', name: 'David Kim', avatarInitials: 'DK' },
    createdAt: '2026-03-05T14:00:00Z',
  },
  {
    id: '3',
    title: 'Friday Night Board Games',
    description:
      'Casual board game night at a local café. We have Catan, Ticket to Ride, and more. Come meet new people and have fun!',
    date: '2026-03-15',
    time: '19:00',
    location: 'The Bean Café, Downtown',
    category: 'Social',
    maxParticipants: 10,
    participants: [
      { id: 'u6', name: 'Frank Torres', avatarInitials: 'FT' },
      { id: 'u7', name: 'Grace Wu', avatarInitials: 'GW' },
      { id: 'u8', name: 'Hank Morris', avatarInitials: 'HM' },
      { id: 'u9', name: 'Iris Chen', avatarInitials: 'IC' },
      { id: 'u10', name: 'Jake Mills', avatarInitials: 'JM' },
      { id: 'u11', name: 'Karen Lee', avatarInitials: 'KL' },
    ],
    createdBy: { id: 'u6', name: 'Frank Torres', avatarInitials: 'FT' },
    createdAt: '2026-03-06T09:00:00Z',
  },
  {
    id: '4',
    title: 'Tech Talk: AI & the Future',
    description:
      'An informal meetup to discuss the latest trends in AI, machine learning, and their impact on everyday life. Presentations and open discussion.',
    date: '2026-03-25',
    time: '17:00',
    location: 'Innovation Hub, Floor 3',
    category: 'Tech',
    maxParticipants: 30,
    participants: [
      { id: 'u12', name: 'Leo Nguyen', avatarInitials: 'LN' },
    ],
    createdBy: { id: 'u12', name: 'Leo Nguyen', avatarInitials: 'LN' },
    createdAt: '2026-03-07T11:30:00Z',
  },
];

interface EventContextValue {
  events: Event[];
  currentUser: Participant;
  createEvent: (
    data: Omit<Event, 'id' | 'participants' | 'createdBy' | 'createdAt'>
  ) => Event;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  isJoined: (eventId: string) => boolean;
  isFull: (eventId: string) => boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const EventContext = createContext<EventContextValue | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);

  const isJoined = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId);
      return event
        ? event.participants.some((p) => p.id === CURRENT_USER.id)
        : false;
    },
    [events]
  );

  const isFull = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId);
      return event ? event.participants.length >= event.maxParticipants : false;
    },
    [events]
  );

  const joinEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (
          event.id === eventId &&
          !event.participants.some((p) => p.id === CURRENT_USER.id) &&
          event.participants.length < event.maxParticipants
        ) {
          return {
            ...event,
            participants: [...event.participants, CURRENT_USER],
          };
        }
        return event;
      })
    );
  }, []);

  const leaveEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            participants: event.participants.filter(
              (p) => p.id !== CURRENT_USER.id
            ),
          };
        }
        return event;
      })
    );
  }, []);

  const createEvent = useCallback(
    (
      data: Omit<Event, 'id' | 'participants' | 'createdBy' | 'createdAt'>
    ): Event => {
      const newEvent: Event = {
        ...data,
        id: `evt-${Date.now()}`,
        participants: [CURRENT_USER],
        createdBy: CURRENT_USER,
        createdAt: new Date().toISOString(),
      };
      setEvents((prev) => [newEvent, ...prev]);
      return newEvent;
    },
    []
  );

  return (
    <EventContext.Provider
      value={{
        events,
        currentUser: CURRENT_USER,
        createEvent,
        joinEvent,
        leaveEvent,
        isJoined,
        isFull,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
