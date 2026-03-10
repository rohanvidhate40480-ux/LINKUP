export interface Participant {
  id: string;
  name: string;
  avatarInitials: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;       // ISO date string YYYY-MM-DD
  time: string;       // HH:MM format
  location: string;
  category: EventCategory;
  maxParticipants: number;
  participants: Participant[];
  createdBy: Participant;
  createdAt: string;
}

export type EventCategory =
  | 'Social'
  | 'Sports'
  | 'Study'
  | 'Music'
  | 'Food & Drink'
  | 'Tech'
  | 'Outdoor'
  | 'Other';

export type View = 'list' | 'create' | 'detail';
