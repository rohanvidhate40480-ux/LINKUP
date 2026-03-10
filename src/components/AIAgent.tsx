import { useState, useRef, useEffect, useCallback } from 'react';
import { useEvents } from '../context/useEvents';
import { generateAIResponse, type ChatMessage } from '../utils/aiAgent';
import './AIAgent.css';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: `Hi! I'm **Linky** 🤖, your LINKUP AI assistant!\n\nI can help you find events, get recommendations, or explain how to use the app.\n\nTry asking me:\n• "Show me all events"\n• "Find outdoor events"\n• "Which events have open spots?"`,
  timestamp: new Date(),
};

function renderMessageText(text: string): string {
  // Escape HTML entities first, then apply simple markdown formatting
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

export function AIAgent() {
  const { events } = useEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsTyping(true);

      // Simulate a short processing delay for a natural feel
      setTimeout(() => {
        const responseText = generateAIResponse(trimmed, events);
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: responseText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 600);
    },
    [events]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(inputValue);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  const QUICK_PROMPTS = [
    'Show all events',
    'Find outdoor events',
    'Any open spots?',
    'Recommend something',
  ];

  return (
    <>
      {/* Floating chat button */}
      <button
        className={`ai-agent__fab ${isOpen ? 'ai-agent__fab--open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        title={isOpen ? 'Close Linky' : 'Chat with Linky AI'}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.7 0-3.29-.45-4.67-1.23l-.33-.19-3.43.95.96-3.43-.2-.33A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.5-6.25c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12-.17.25-.64.8-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.42c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z" />
          </svg>
        )}
        {!isOpen && <span className="ai-agent__fab-badge">AI</span>}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="ai-agent__panel" role="dialog" aria-label="AI assistant chat" aria-modal="true">
          {/* Header */}
          <div className="ai-agent__header">
            <div className="ai-agent__header-info">
              <div className="ai-agent__avatar">🤖</div>
              <div>
                <p className="ai-agent__name">Linky</p>
                <p className="ai-agent__status">
                  <span className="ai-agent__status-dot" />
                  AI Event Assistant
                </p>
              </div>
            </div>
            <button
              className="ai-agent__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="ai-agent__messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-agent__message ai-agent__message--${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <div className="ai-agent__message-avatar">🤖</div>
                )}
                <div
                  className="ai-agent__bubble"
                  dangerouslySetInnerHTML={{ __html: renderMessageText(msg.text) }}
                />
              </div>
            ))}

            {isTyping && (
              <div className="ai-agent__message ai-agent__message--assistant">
                <div className="ai-agent__message-avatar">🤖</div>
                <div className="ai-agent__bubble ai-agent__bubble--typing">
                  <span className="ai-agent__dot" />
                  <span className="ai-agent__dot" />
                  <span className="ai-agent__dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="ai-agent__quick-prompts">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className="ai-agent__quick-btn"
                onClick={() => sendMessage(prompt)}
                disabled={isTyping}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="ai-agent__input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="ai-agent__input"
              type="text"
              placeholder="Ask me about events…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              aria-label="Message input"
              maxLength={300}
            />
            <button
              type="submit"
              className="ai-agent__send"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
