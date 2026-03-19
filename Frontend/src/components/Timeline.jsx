import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart, Tag } from 'lucide-react';

const moodEmoji = {
  happy: '😊',
  grateful: '🙏',
  nostalgic: '🌅',
  peaceful: '☮️',
  sad: '🌧️',
  excited: '✨'
};

// Group flat memories array by YYYY-MM
function groupByMonth(memories) {
  const groups = {};

  memories.forEach(m => {
    if (!m.date) return; // ✅ FIX: prevent crash

    const date = new Date(m.date);
    const key = format(date, 'yyyy-MM');

    if (!groups[key]) {
      groups[key] = {
        label: format(date, 'MMMM yyyy'),
        items: []
      };
    }

    groups[key].items.push(m);
  });

  return Object.values(groups);
}

export default function Timeline({ memories = [], onToggleFav }) {
  const navigate = useNavigate();
  const groups = groupByMonth(memories);

  if (memories.length === 0) {
    return (
      <div className="text-center py-16 text-brown-400">
        <p className="font-serif text-2xl mb-2">No memories yet</p>
        <p className="text-sm">Start writing your first entry</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {groups.map((group) => (
        <div key={group.label}>

          {/* Month header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-brown-400 flex-shrink-0" />
            <h3 className="font-serif text-lg font-semibold text-brown-700 dark:text-brown-200">
              {group.label}
            </h3>
            <div className="flex-1 h-px bg-brown-200 dark:bg-brown-700" />
            <span className="text-xs text-brown-400 font-medium">
              {group.items.length} memor{group.items.length === 1 ? 'y' : 'ies'}
            </span>
          </div>

          {/* Timeline items */}
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-brown-200 dark:bg-brown-700" />

            <div className="space-y-4">
              {group.items.map((memory, i) => {
                const id = String(memory._id); // ✅ FIX: ID consistency
                const isFav = Boolean(memory.isFavorite); // ✅ FIX

                return (
                  <div
                    key={id}
                    className="flex gap-4 animate-slide-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Date dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-brown-800 border-2 border-brown-300 dark:border-brown-600 flex items-center justify-center text-lg shadow-sm relative z-10">
                        {moodEmoji[memory.mood] || '📝'}
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      className="flex-1 card p-4 cursor-pointer hover:border-brown-300 dark:hover:border-brown-500 transition-all group mb-0"
                      onClick={() => navigate(`/memory/${id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">

                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-brown-400 font-medium">
                              {memory.date
                                ? format(new Date(memory.date), 'EEEE, d')
                                : 'No date'}
                            </span>

                            {isFav && (
                              <Heart size={11} className="fill-red-400 text-red-400" />
                            )}
                          </div>

                          <h4 className="font-serif text-base font-semibold text-brown-800 dark:text-brown-100 truncate group-hover:text-brown-600 dark:group-hover:text-brown-300 transition-colors">
                            {memory.title || 'Untitled'}
                          </h4>

                          <p className="text-sm text-brown-500 dark:text-brown-400 mt-1 line-clamp-2">
                            {memory.description || ''}
                          </p>
                        </div>

                        {/* Thumbnail */}
                        {memory.images?.[0]?.url && ( // ✅ FIX
                          <img
                            src={memory.images[0].url}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg ml-3 flex-shrink-0"
                          />
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-3 mt-2.5 flex-wrap">

                        {memory.tags?.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-brown-400">
                            <Tag size={10} />
                            {memory.tags.slice(0, 3).join(', ')}
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFav(id); // ✅ FIX: pass string id
                          }}
                          className="ml-auto flex items-center gap-1 text-xs text-brown-400 hover:text-red-400 transition-colors"
                        >
                          <Heart
                            size={13}
                            className={isFav ? 'fill-red-400 text-red-400' : ''}
                          />
                          {isFav ? 'Saved' : 'Save'}
                        </button>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}