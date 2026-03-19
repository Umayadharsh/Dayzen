import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Hash, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const moodEmoji = {
  happy: '😊',
  grateful: '🙏',
  nostalgic: '🌅',
  peaceful: '☮️',
  sad: '🌧️',
  excited: '✨'
};

export default function SearchBar({ memories = [], isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setActiveIdx(0);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      return;
    }

    const matched = memories.filter(m => {
      const inTitle = m.title?.toLowerCase().includes(q);
      const inDesc = m.description?.toLowerCase().includes(q);
      const inMood = m.mood?.toLowerCase().includes(q);
      const inTags = m.tags?.some(t => t.toLowerCase().includes(q));
      const inDate = format(new Date(m.date), 'MMMM yyyy dd')
        .toLowerCase()
        .includes(q);

      return inTitle || inDesc || inMood || inTags || inDate;
    });

    setResults(matched.slice(0, 8));
    setActiveIdx(0);
  }, [query, memories]);

  // Highlight match
  const highlight = (text = '', q = '') => {
    if (!q.trim()) return text;

    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;

    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-brown-200 dark:bg-brown-600 text-brown-900 dark:text-brown-100 rounded px-0.5">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  // Navigate
  const goTo = useCallback((memory) => {
    navigate(`/memory/${memory._id}`);
    onClose();
  }, [navigate, onClose]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') return onClose();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    }

    if (e.key === 'Enter' && results[activeIdx]) {
      goTo(results[activeIdx]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-brown-900/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <div className="relative w-full max-w-lg bg-white dark:bg-brown-800 rounded-2xl shadow-2xl border border-brown-100 dark:border-brown-700 overflow-hidden animate-scale-in">

          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-brown-100 dark:border-brown-700">
            <Search size={18} className="text-brown-400" />

            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search memories, moods, tags..."
              className="flex-1 bg-transparent text-brown-900 dark:text-brown-100 text-base placeholder:text-brown-300 dark:placeholder:text-brown-500 outline-none"
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-brown-400 hover:text-brown-600 dark:hover:text-brown-200 transition"
              >
                <X size={16} />
              </button>
            )}

            <kbd className="hidden sm:flex text-xs text-brown-400 dark:text-brown-500 bg-brown-100 dark:bg-brown-700 px-1.5 py-0.5 rounded-md font-mono border border-brown-200 dark:border-brown-600">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[380px] overflow-y-auto">

            {/* Empty */}
            {!query && (
              <div className="px-4 py-8 text-center">
                <p className="text-brown-400 text-sm">Start typing to search</p>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {Object.keys(moodEmoji).map(m => (
                    <button
                      key={m}
                      onClick={() => setQuery(m)}
                      className="flex items-center gap-1 bg-brown-50 dark:bg-brown-700 px-3 py-1.5 rounded-full text-xs"
                    >
                      {moodEmoji[m]} {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {query && results.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-brown-400">
                No memories found for "{query}"
              </div>
            )}

            {/* Results list */}
            {results.length > 0 && (
              <ul>
                {results.map((memory, i) => (
                  <li key={memory._id}>
                    <button
                      onClick={() => goTo(memory)}
                      onMouseEnter={() => setActiveIdx(i)}
                      className={`w-full flex gap-3 px-4 py-3 text-left ${
                        activeIdx === i ? 'bg-brown-100 dark:bg-brown-700' : ''
                      }`}
                    >
                      <span>{moodEmoji[memory.mood] || '📝'}</span>

                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {highlight(memory.title, query)}
                        </p>

                        <p className="text-xs text-brown-400">
                          {highlight(memory.description, query)}
                        </p>

                        {memory.tags?.length > 0 && (
                          <div className="flex gap-1 text-xs text-brown-400">
                            <Hash size={10} />
                            {memory.tags.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-brown-400">
                        {format(new Date(memory.date), 'MMM d')}
                      </div>

                      {activeIdx === i && <ArrowRight size={14} />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}