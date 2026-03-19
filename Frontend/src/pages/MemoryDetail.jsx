import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Heart, MapPin, Tag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import MemoryForm from '../components/MemoryForm';
import toast from 'react-hot-toast';

const moodEmoji = {
  happy: '😊', grateful: '🙏', nostalgic: '🌅',
  peaceful: '☮️', sad: '🌧️', excited: '✨'
};
const moodLabel = {
  happy: 'Happy', grateful: 'Grateful', nostalgic: 'Nostalgic',
  peaceful: 'Peaceful', sad: 'Sad', excited: 'Excited'
};

// Simple skeleton component for loading state
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-brown-100 dark:bg-brown-800 rounded-xl ${className}`} />;
}

export default function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/memories/${id}`);
        setMemory(data.memory);
      } catch {
        toast.error('Memory not found');
        navigate('/');
      } finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await api.delete(`/api/memories/${id}`);
      toast.success('Memory deleted');
      navigate('/');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleFav = async () => {
    const { data } = await api.patch(`/api/memories/${id}/favorite`);
    setMemory(data.memory);
  };

  if (loading) return (
    <div className="min-h-screen bg-cream dark:bg-brown-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );

  if (!memory) return null;

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-900">
      <Navbar />

      <article className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">

        {/* Back + actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-brown-500 hover:text-brown-800 dark:hover:text-brown-200 transition font-medium text-sm"
          >
            <ArrowLeft size={16} /> Back to journal
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFav}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Heart
                size={16}
                className={memory.isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-brown-400'}
              />
              <span className="text-brown-500 dark:text-brown-400">
                {memory.isFavorite ? 'Saved' : 'Save'}
              </span>
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 rounded-lg text-brown-400 hover:text-brown-700 hover:bg-brown-100 dark:hover:bg-brown-800 transition"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-brown-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Image gallery */}
        {memory.images?.length > 0 && (
          <div className="mb-6">
            <img
              src={memory.images[activeImg].url}
              alt={memory.images[activeImg].caption || memory.title}
              className="w-full h-64 sm:h-80 object-cover rounded-2xl"
            />
            {memory.images.length > 1 && (
              <div className="flex gap-2 mt-2">
                {memory.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                      activeImg === i
                        ? 'border-brown-500'
                        : 'border-transparent hover:border-brown-300'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Memory content */}
        <div className="card p-6 sm:p-8">
          {/* Mood badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{moodEmoji[memory.mood]}</span>
            <span className="text-sm font-medium text-brown-500 bg-brown-50 dark:bg-brown-700 dark:text-brown-300 px-3 py-0.5 rounded-full">
              {moodLabel[memory.mood]}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 dark:text-brown-50 mb-2 leading-snug">
            {memory.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-brown-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {format(new Date(memory.date), 'EEEE, MMMM d, yyyy')}
            </span>
            {memory.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} /> {memory.location}
              </span>
            )}
            {memory.weather && (
              <span>🌤 {memory.weather}</span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none text-brown-700 dark:text-brown-300 leading-relaxed whitespace-pre-wrap font-sans text-base">
            {memory.description}
          </div>

          {/* Tags */}
          {memory.tags?.length > 0 && (
            <div className="mt-6 pt-5 border-t border-brown-100 dark:border-brown-700">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={14} className="text-brown-400" />
                {memory.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-sm bg-brown-100 dark:bg-brown-700 text-brown-600 dark:text-brown-300 px-3 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-4 text-xs text-brown-300 dark:text-brown-600">
            Created {format(new Date(memory.createdAt), 'MMM d, yyyy · h:mm a')}
            {memory.updatedAt !== memory.createdAt && (
              <span> · Updated {format(new Date(memory.updatedAt), 'MMM d')}</span>
            )}
          </div>
        </div>
      </article>

      {/* Edit modal */}
      {editOpen && (
        <MemoryForm
          memory={memory}
          onClose={() => setEditOpen(false)}
          onSaved={async () => {
            const { data } = await api.get(`/api/memories/${id}`);
            setMemory(data.memory);
          }}
        />
      )}
    </div>
  );
}