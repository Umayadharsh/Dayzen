import { Heart, Trash2, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const moodEmoji = {
  happy: '😊',
  grateful: '🙏',
  nostalgic: '🌅',
  peaceful: '☮️',
  sad: '🌧️',
  excited: '✨',
};

const moodBg = {
  happy: 'bg-yellow-50 dark:bg-yellow-900/10',
  grateful: 'bg-purple-50 dark:bg-purple-900/10',
  nostalgic: 'bg-orange-50 dark:bg-orange-900/10',
  peaceful: 'bg-green-50 dark:bg-green-900/10',
  sad: 'bg-blue-50 dark:bg-blue-900/10',
  excited: 'bg-pink-50 dark:bg-pink-900/10',
};

export default function MemoryCard({ memory, onEdit, onDelete, onToggleFav }) {
  const navigate = useNavigate();

  // Navigate to detail page
  const handleCardClick = () => {
    navigate(`/memory/${memory._id}`);
  };

  // Prevent card click when interacting with buttons
  const stop = (e) => e.stopPropagation();

  const handleFav = (e) => {
    stop(e);
    onToggleFav(memory._id);
  };

  const handleEdit = (e) => {
    stop(e);
    onEdit(memory);
  };

  const handleDelete = (e) => {
    stop(e);
    onDelete(memory._id);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`card p-5 cursor-pointer group transition-all duration-200 hover:shadow-lg ${
        moodBg[memory.mood] || ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-xs text-brown-400 font-medium">
            {memory?.date
              ? format(new Date(memory.date), 'EEE, MMM d yyyy')
              : 'No date'}
          </span>

          <h3 className="font-serif text-lg text-brown-800 dark:text-brown-100 mt-1 truncate">
            {memory.title || 'Untitled Memory'}
          </h3>
        </div>

        <span className="text-xl ml-2">
          {moodEmoji[memory.mood] || '📝'}
        </span>
      </div>

      {/* Image */}
      {memory?.images?.length > 0 && (
        <img
          src={memory.images[0].url}
          alt="memory"
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
      )}

      {/* Description */}
      <p className="text-brown-600 dark:text-brown-300 text-sm line-clamp-3">
        {memory.description || 'No description'}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brown-100 dark:border-brown-700">

        {/* Favorite */}
        <button
          onClick={handleFav}
          className="flex items-center gap-1 text-sm text-brown-400 hover:text-red-500 transition"
        >
          <Heart
            size={15}
            className={`transition ${
              memory.isfavorite ? 'fill-red-500 text-red-500' : ''
            }`}
          />
          {memory.isfavorite ? 'Saved' : 'Save'}
        </button>

        {/* Edit / Delete */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg hover:bg-brown-100 dark:hover:bg-brown-700 transition"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>

          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}