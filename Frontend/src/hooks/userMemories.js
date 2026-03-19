import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function useMemories() {
  // ── State ─────────────────────────────────────────
  const [memories, setMemories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [total, setTotal]       = useState(0);

  // ── Filters ───────────────────────────────────────
  const [filters, setFiltersState] = useState({
    startDate: '',
    endDate: '',
    favorites: false,
    tags: '',
    page: 1,
    limit: 20,
  });

  const setFilters = useCallback((updates) => {
    setFiltersState(prev => ({ ...prev, ...updates, page: 1 }));
  }, []);

  // ── FETCH ─────────────────────────────────────────
  const fetchMemories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.favorites) params.favorites = 'true';
      if (filters.tags) params.tags = filters.tags;

      params.page = filters.page;
      params.limit = filters.limit;

      const { data } = await api.get('/api/memories', { params });

      setMemories(data.memories || []);
      setTotal(data.total || 0);

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load memories';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // ── CREATE ────────────────────────────────────────
  const createMemory = useCallback(async (formData) => {
    try {
      const { data } = await api.post('/api/memories', formData);

      setMemories(prev => [data.memory, ...prev]);
      setTotal(prev => prev + 1);

      toast.success('Memory saved! 🌟');
      return data.memory;

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save memory';
      toast.error(msg);
      throw err;
    }
  }, []);

  // ── TOGGLE FAVORITE (FIXED) ───────────────────────
  const toggleFavorite = useCallback(async (id) => {
    const strId = String(id);

    // optimistic UI update
    setMemories(prev =>
      prev.map(m =>
        String(m._id) === strId
          ? { ...m, isFavorite: !m.isFavorite }
          : m
      )
    );

    try {
      await api.patch(`/api/memories/${strId}/favorite`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update favorite');

      // rollback if failed
      fetchMemories();
    }
  }, [fetchMemories]);

  // ── DELETE ────────────────────────────────────────
  const deleteMemory = useCallback(async (id) => {
    const strId = String(id);

    setMemories(prev =>
      prev.filter(m => String(m._id) !== strId)
    );
    setTotal(prev => prev - 1);

    try {
      await api.delete(`/api/memories/${strId}`);
      toast.success('Memory deleted');
    } catch {
      toast.error('Delete failed — restoring');
      fetchMemories();
    }
  }, [fetchMemories]);

  // ── UPDATE ────────────────────────────────────────
  const updateMemory = useCallback(async (id, formData) => {
    const strId = String(id);

    try {
      const { data } = await api.patch(`/memories/${strId}`, formData);

      setMemories(prev =>
        prev.map(m =>
          String(m._id) === strId ? data.memory : m
        )
      );

      toast.success('Memory updated!');
      return data.memory;

    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update';
      toast.error(msg);
      throw err;
    }
  }, []);

  // ── RETURN ────────────────────────────────────────
  return {
    memories,
    loading,
    error,
    total,
    filters,
    setFilters,
    refetch: fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
    toggleFavorite,
  };
}