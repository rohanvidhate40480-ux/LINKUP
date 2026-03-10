import type { Event, EventCategory } from '../types/event';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const GREETINGS = [
  'hello', 'hi', 'hey', 'howdy', 'sup', 'greetings', 'good morning',
  'good afternoon', 'good evening',
];

const CATEGORY_KEYWORDS: Record<EventCategory, string[]> = {
  Social: ['social', 'hangout', 'meetup', 'meet', 'friends', 'party', 'gathering', 'board game', 'game night'],
  Sports: ['sport', 'sports', 'fitness', 'gym', 'workout', 'exercise', 'run', 'running', 'football', 'basketball', 'soccer'],
  Study: ['study', 'studying', 'learn', 'learning', 'school', 'class', 'education', 'tutorial', 'workshop', 'coding', 'programming', 'web dev'],
  Music: ['music', 'concert', 'band', 'sing', 'singing', 'instrument', 'jazz', 'rock', 'pop', 'live music'],
  'Food & Drink': ['food', 'drink', 'eat', 'eating', 'restaurant', 'cafe', 'coffee', 'dinner', 'lunch', 'brunch', 'cooking', 'foodie'],
  Tech: ['tech', 'technology', 'ai', 'coding', 'programming', 'developer', 'software', 'startup', 'hackathon', 'innovation'],
  Outdoor: ['outdoor', 'outside', 'hike', 'hiking', 'nature', 'park', 'trail', 'camping', 'adventure', 'walk'],
  Other: ['other', 'misc', 'miscellaneous'],
};

function formatDate(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}`).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatEventSummary(event: Event): string {
  const spotsLeft = event.maxParticipants - event.participants.length;
  const availability = spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full';
  return `• **${event.title}** (${event.category})\n  📅 ${formatDate(event.date, event.time)}\n  📍 ${event.location}\n  👥 ${event.participants.length}/${event.maxParticipants} — ${availability}`;
}

function detectCategory(text: string): EventCategory | null {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return cat as EventCategory;
    }
  }
  return null;
}

function detectIntent(text: string): string {
  const lower = text.toLowerCase();

  if (GREETINGS.some((g) => lower.includes(g))) return 'greeting';
  if (lower.includes('help') || lower.includes('what can you do') || lower.includes('how do') || lower.includes('how to')) return 'help';
  if (lower.includes('create') || lower.includes('add') || lower.includes('make') || lower.includes('new event') || lower.includes('host')) return 'create';
  if (lower.includes('join') || lower.includes('sign up') || lower.includes('participate')) return 'join';
  if (lower.includes('leave') || lower.includes('remove') || lower.includes('cancel')) return 'leave';
  if (lower.includes('full') || lower.includes('available') || lower.includes('spot') || lower.includes('open')) return 'availability';
  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('best') || lower.includes('popular') || lower.includes('good')) return 'recommend';
  if (lower.includes('all event') || lower.includes('list event') || lower.includes('show event') || lower.includes('what event') || lower.includes('events')) return 'list';
  if (lower.includes('upcoming') || lower.includes('next') || lower.includes('soon')) return 'upcoming';
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('thx')) return 'thanks';
  if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('see you')) return 'goodbye';

  return 'search';
}

export function generateAIResponse(userMessage: string, events: Event[]): string {
  const detectedCategory = detectCategory(userMessage);
  const lower = userMessage.toLowerCase();
  // If a specific category is detected alongside a search/find/show keyword, treat it as a category search
  const hasCategorySearchIntent =
    detectedCategory !== null &&
    (lower.includes('find') || lower.includes('show') || lower.includes('search') ||
      lower.includes('look') || lower.includes('get') || lower.includes('list') ||
      lower.includes('what') || lower.includes('any') || lower.includes('event'));
  const intent = hasCategorySearchIntent ? 'category_search' : detectIntent(userMessage);

  switch (intent) {
    case 'greeting':
      return `Hi there! 👋 I'm **Linky**, your LINKUP AI assistant!\n\nI can help you:\n• 🔍 Find events by category or keyword\n• 📅 Show upcoming events\n• ✨ Recommend events for you\n• ℹ️ Explain how to use LINKUP\n\nWhat would you like to do today?`;

    case 'help':
      return `Here's what I can help you with:\n\n**Discover Events**\n• Ask me to find events by category (e.g., "find tech events" or "show me outdoor activities")\n• Ask about upcoming events\n• Get event recommendations\n\n**Using LINKUP**\n• **Browse events** — Scroll through the event list on the main page\n• **Join a pool** — Click "Join Pool" on any event card\n• **Create an event** — Hit the "+ Create Event" button\n• **Filter events** — Use the category chips or search bar\n\nWhat would you like to know more about?`;

    case 'create':
      return `To create a new event on LINKUP:\n\n1. Click the **"+ Create Event"** button in the top-right of the event list\n2. Fill in the event details:\n   • Title, description\n   • Date and time\n   • Location\n   • Category\n   • Maximum participants\n3. Click **"Create & Join Pool"** — you'll automatically join as the first participant!\n\nYour event will appear in the list and others can join the pool. 🎉`;

    case 'join':
      return `Joining an event pool is easy!\n\n1. **Browse** the event list on the main page\n2. Find an event you're interested in\n3. Click **"Join Pool"** on the event card, or open the event detail and click the join button\n\nYou'll be added to the participant pool instantly. Events that are full will show a "Full" badge — keep an eye out for newly created events!`;

    case 'leave':
      return `To leave an event pool:\n\n1. Find the event you joined (use the "My Events" toggle to filter)\n2. Click **"Leave Pool"** on the event card or in the event detail view\n\nYou can always rejoin later if there are spots available.`;

    case 'availability': {
      const available = events.filter(
        (e) => e.participants.length < e.maxParticipants
      );
      if (available.length === 0) {
        return `All current events are full right now. You could **create a new event** and invite others to join your pool! 🎯`;
      }
      const list = available.slice(0, 4).map(formatEventSummary).join('\n\n');
      return `Here are events with open spots:\n\n${list}\n\nClick on any event card to view details and join!`;
    }

    case 'recommend': {
      const category = detectedCategory;
      let candidates = category
        ? events.filter((e) => e.category === category)
        : events;

      // Sort by available spots (not full first), then by date
      candidates = [...candidates]
        .filter((e) => e.participants.length < e.maxParticipants)
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`).getTime();
          const dateB = new Date(`${b.date}T${b.time}`).getTime();
          return dateA - dateB;
        });

      if (candidates.length === 0) {
        return category
          ? `I couldn't find any available **${category}** events right now. Try browsing other categories or create your own!`
          : `All events are currently full. Why not create a new event and start your own pool? 🚀`;
      }

      const top = candidates.slice(0, 3).map(formatEventSummary).join('\n\n');
      const categoryNote = category ? ` in **${category}**` : '';
      return `Here are my top picks${categoryNote}:\n\n${top}\n\nClick on any event card to learn more and join the pool!`;
    }

    case 'list': {
      if (events.length === 0) {
        return `There are no events yet. Be the first to create one! 🌟`;
      }
      const list = events.slice(0, 5).map(formatEventSummary).join('\n\n');
      const more = events.length > 5 ? `\n\n...and ${events.length - 5} more! Browse the full list on the main page.` : '';
      return `Here are the current events:\n\n${list}${more}`;
    }

    case 'upcoming': {
      const now = new Date();
      const upcoming = events
        .filter((e) => new Date(`${e.date}T${e.time}`) > now)
        .sort((a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
        )
        .slice(0, 4);

      if (upcoming.length === 0) {
        return `No upcoming events found. Check back later or create a new event!`;
      }
      const list = upcoming.map(formatEventSummary).join('\n\n');
      return `Here are the next upcoming events:\n\n${list}`;
    }

    case 'thanks':
      return `You're welcome! 😊 Let me know if you need anything else. Happy pooling!`;

    case 'goodbye':
      return `Goodbye! 👋 Come back anytime you want to discover events or need help. See you on LINKUP!`;

    case 'category_search': {
      const matches = events.filter((e) => e.category === detectedCategory);
      if (matches.length === 0) {
        return `I couldn't find any **${detectedCategory}** events right now. You can create one using the "+ Create Event" button!`;
      }
      const list = matches.map(formatEventSummary).join('\n\n');
      return `Here are the **${detectedCategory}** events I found:\n\n${list}`;
    }

    default: {

      // Fuzzy search by title/description/location
      const keywords = lower.split(/\s+/).filter((w) => w.length > 2);
      const matches = events.filter((e) =>
        keywords.some(
          (kw) =>
            e.title.toLowerCase().includes(kw) ||
            e.description.toLowerCase().includes(kw) ||
            e.location.toLowerCase().includes(kw)
        )
      );

      if (matches.length > 0) {
        const list = matches.slice(0, 4).map(formatEventSummary).join('\n\n');
        return `I found some events that might match:\n\n${list}`;
      }

      return `I'm not sure I understood that. Here are some things you can ask me:\n\n• "Show me all events"\n• "Find outdoor events"\n• "Recommend a tech event"\n• "How do I create an event?"\n• "Which events have open spots?"\n\nWhat would you like to explore?`;
    }
  }
}
