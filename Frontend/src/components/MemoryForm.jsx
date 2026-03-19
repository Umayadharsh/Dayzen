import { useState } from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import toast from 'react-hot-toast';

const MOODS = [
  { value: 'happy',     label: 'Happy',     emoji: '😊' },
  { value: 'grateful',  label: 'Grateful',  emoji: '🙏' },
  { value: 'nostalgic', label: 'Nostalgic', emoji: '🌅' },
  { value: 'peaceful',  label: 'Peaceful',  emoji: '☮️' },
  { value: 'sad',       label: 'Sad',       emoji: '🌧️' },
  { value: 'excited',   label: 'Excited',   emoji: '✨' },
];

export default function MemoryForm({ memory, onClose, onSaved }) {
  // Form state
  const [title, setTitle] = useState(memory?.title || '');
  const [description, setDesc] = useState(memory?.description || '');
  const [date, setDate] = useState(
    memory?.date
      ? format(new Date(memory.date), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd')
  );
  
  const [mood, setMood] = useState(memory?.mood || 'happy');

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    if (!date) e.date = 'Date is required';
    return e;
  };

  // Submit
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("SUBMIT WORKING");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSaving(true);

    const payload = {
  title: title.trim(),
  description: description.trim(),
  date: new Date(date).toISOString(),
  mood,
};
    try {
      if (memory?._id) {
        await api.patch(`/api/memories/${memory._id}`, payload);
        toast.success('Memory updated! ✏️');
      } else {
        await api.post('/api/memories', payload);
        toast.success('Memory saved! 🌟');
      }

      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
      console.error(err.response?.data);
      console.error('Save error:', err);
      console.log("SUBMIT TRIGGERED");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={(e) => {
  if (e.target === e.currentTarget && !saving) {
    onClose();
  }
}}
      >
        <div className="bg-white dark:bg-brown-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brown-100 dark:border-brown-700">
            <h2 className="font-serif text-xl text-brown-800 dark:text-brown-100">
              {memory ? 'Edit memory' : 'New memory'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-brown-400 hover:text-brown-700 hover:bg-brown-100 dark:hover:bg-brown-700 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">

            {/* Title */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-1.5 block">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What made today memorable?"
                className={`input ${errors.title ? 'border-red-400' : ''}`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-1.5 block">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={`input ${errors.date ? 'border-red-400' : ''}`}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Mood */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-2 block">
                How are you feeling?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMood(value);
                    }}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                      mood === value
                        ? 'border-brown-500 bg-brown-50 dark:bg-brown-700 text-brown-700 dark:text-brown-200'
                        : 'border-brown-100 dark:border-brown-700 text-brown-400 dark:text-brown-500 hover:border-brown-300 dark:hover:border-brown-500 hover:bg-brown-50 dark:hover:bg-brown-700/50'
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-1.5 block">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                rows={4}
                placeholder="Write about your memory..."
                className={`input resize-none ${errors.description ? 'border-red-400' : ''}`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">
                Cancel
              </button>

              <button type="button" onClick = {handleSubmit} disabled={saving} className="btn-primary flex-1">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </span>
                ) : memory ? 'Update memory' : 'Save memory'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}