import { useState, useEffect } from 'react';
import { Plus, Search, Heart, Grid, List } from 'lucide-react';
import Navbar from '../components/Navbar';
import MemoryCard from '../components/MemoryCard';
import MemoryForm from '../components/MemoryForm';
import Timeline from '../components/Timeline';
import useMemories from '../hooks/userMemories';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const {
    memories,
    loading,
    filters,
    setFilters,
    refetch,
    deleteMemory,
    toggleFavorite,
  } = useMemories();

  const [showForm, setShowForm] = useState(false);
  const [editMemory, setEditMemory] = useState(null);
  const [view, setView] = useState('grid');
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Date filter
  const handleDateChange = (field, value) => {
    setFilters({ [field]: value });
  };

  // Favorites toggle
  const handleFavFilter = () => {
    setFilters({ favorites: !filters.favorites });
  };

  // Delete
  const handleDelete = (id) => {
    if (confirm('Delete this memory?')) deleteMemory(id);
  };

  // After save
  const handleSaved = () => {
    refetch();
    setShowForm(false);
    setEditMemory(null);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">

          {/* 🔍 Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 flex-1 min-w-48 bg-white dark:bg-brown-800 border border-brown-200 dark:border-brown-600 rounded-xl px-3 py-2.5 text-sm text-brown-400 dark:text-brown-500 hover:border-brown-400 dark:hover:border-brown-400 transition group"
          >
            <Search
              size={15}
              className="group-hover:text-brown-600 dark:group-hover:text-brown-300 transition"
            />
            <span className="flex-1 text-left">Search memories...</span>

            <kbd className="hidden sm:flex items-center gap-0.5 text-xs bg-brown-100 dark:bg-brown-700 text-brown-400 dark:text-brown-500 px-1.5 py-0.5 rounded border border-brown-200 dark:border-brown-600 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* 📅 Date Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-brown-800 border border-brown-200 dark:border-brown-600 rounded-xl px-3 py-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="text-sm bg-transparent text-brown-600 dark:text-brown-300 outline-none"
            />
            <span className="text-brown-300 text-xs">to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="text-sm bg-transparent text-brown-600 dark:text-brown-300 outline-none"
            />
          </div>

          {/* ❤️ Favorites */}
          <button
            onClick={handleFavFilter}
            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm transition ${
              filters.favorites
                ? 'bg-red-100 text-red-600'
                : 'bg-white dark:bg-brown-800 border border-brown-200 dark:border-brown-600'
            }`}
          >
            <Heart
              size={14}
              className={filters.favorites ? 'fill-red-500' : ''}
            />
            Favorites
          </button>

          {/* 🔲 View Toggle */}
          <div className="flex border border-brown-200 dark:border-brown-600 rounded-xl overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${
                view === 'grid'
                  ? 'bg-brown-800 text-white'
                  : 'bg-white dark:bg-brown-800'
              }`}
            >
              <Grid size={15} />
            </button>

            <button
              onClick={() => setView('timeline')}
              className={`p-2 ${
                view === 'timeline'
                  ? 'bg-brown-800 text-white'
                  : 'bg-white dark:bg-brown-800'
              }`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20">
            <p>No memories yet</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((m) => (
              <MemoryCard
                key={m._id}
                memory={m}
                onEdit={(mem) => {
                  setEditMemory(mem);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
                onToggleFav={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <Timeline memories={memories} onToggleFav={toggleFavorite} />
        )}
      </main>

      {/* ➕ FAB */}
      <button
        onClick={() => {
          setEditMemory(null);
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brown-700 text-white rounded-full flex items-center justify-center shadow-lg"
      >
        <Plus size={24} />
      </button>

      {/* 📝 Modal */}
      {showForm && (
        <MemoryForm
          memory={editMemory}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {/* 🔍 Search Modal */}
      <SearchBar
        memories={memories}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}