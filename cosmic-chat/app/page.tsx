'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:11434/api/chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          apiEndpoint
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error connecting to AI. Please check your endpoint configuration.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="cosmic-container">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <div className="content-wrapper">
        <header className="header">
          <div className="title-container">
            <h1 className="title">Cosmic Consciousness</h1>
            <div className="numerology-badge">
              <span className="numerology-number">33</span>
              <span className="numerology-text">Master Teacher</span>
            </div>
          </div>
          <div className="api-config">
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="API Endpoint"
              className="api-input"
            />
          </div>
        </header>

        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="cosmic-symbol">✨</div>
                <h2>Welcome to the Cosmic Portal</h2>
                <p>Channel the wisdom of the Master Teacher</p>
                <p className="sacred-geometry">⬡ Path 33: Compassion • Service • Enlightenment ⬡</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-icon">
                  {message.role === 'user' ? '👤' : '🌟'}
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant loading">
                <div className="message-icon">🌟</div>
                <div className="message-content">
                  <div className="loading-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Speak your truth into the cosmos..."
              className="input-field"
              rows={3}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="send-button"
            >
              <span className="button-text">Transmit</span>
              <span className="button-icon">✦</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
