import { useState } from 'react';
import {
  Send,
  Bot,
  User,
  MessageSquare,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function Chat() {
  const [messages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will be implemented when RAG is connected
    if (!inputValue.trim()) return;
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in-up">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-2">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 border border-brand-500/20 flex items-center justify-center mb-6">
              <Sparkles size={32} className="text-brand-400" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Ask your documents anything
            </h2>
            <p className="text-sm text-text-muted max-w-md leading-relaxed mb-8">
              Once you've uploaded and indexed documents, you can ask questions
              and get AI-powered answers with source citations from your
              knowledge base.
            </p>

            {/* Suggestion cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
              {[
                {
                  icon: FileText,
                  text: 'Summarize the key points from my documents',
                },
                {
                  icon: MessageSquare,
                  text: 'What are the main topics covered?',
                },
                {
                  icon: Bot,
                  text: 'Find specific information in my files',
                },
                {
                  icon: Sparkles,
                  text: 'Compare insights across documents',
                },
              ].map((suggestion, i) => (
                <button
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl
                    bg-surface-tertiary/40 border border-border-default
                    text-left text-sm text-text-secondary
                    hover:bg-surface-tertiary/70 hover:border-border-hover hover:text-text-primary
                    transition-default"
                >
                  <suggestion.icon
                    size={16}
                    className="text-text-muted mt-0.5 shrink-0"
                  />
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages - placeholder structure for future use */
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-brand-600'
                      : 'bg-surface-tertiary border border-border-default'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-brand-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm text-text-primary leading-relaxed">
                    {msg.content}
                  </div>
                  {/* Source citations area */}
                  {msg.role === 'assistant' && msg.sources && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.sources.map((src, j) => (
                        <div
                          key={j}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
                            bg-surface-tertiary/60 border border-border-default
                            text-xs text-text-muted hover:text-text-secondary hover:border-border-hover
                            transition-default cursor-pointer"
                        >
                          <FileText size={12} />
                          {src}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-border-default bg-surface-secondary/30 backdrop-blur-sm px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about your documents…"
            className="w-full pl-5 pr-14 py-3.5 rounded-xl text-sm
              bg-surface-tertiary/60 border border-border-default
              text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30
              transition-default"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2
              w-9 h-9 rounded-lg bg-brand-600 hover:bg-brand-700
              flex items-center justify-center
              text-white disabled:opacity-30 disabled:cursor-not-allowed
              transition-default cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-center text-xs text-text-muted mt-2.5 max-w-3xl mx-auto">
          RAG pipeline is not yet configured. Connect an embedding model and
          vector database to enable intelligent retrieval.
        </p>
      </div>
    </div>
  );
}
