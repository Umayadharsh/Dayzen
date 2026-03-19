const Memory = require('../models/Memory');

// GET /api/memories - list with filters
exports.getMemories = async (req, res) => {
  try {
    const { startDate, endDate, favorites, page = 1, limit = 20 } = req.query;
    const query = { user: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (favorites === 'true') query.isFavorite = true;
     

    const skip = (page - 1) * limit;
    const [memories, total] = await Promise.all([
      Memory.find(query)
        .sort({ date: -1 })
        .skip(skip).limit(Number(limit)),
      Memory.countDocuments(query)
    ]);

    res.json({ memories, total, page: Number(page),
      totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/memories/:id
exports.getMemory = async (req, res) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, user: req.user.id });
    if (!memory) return res.status(404).json({ message: 'Memory not found' });
    res.json({ memory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/memories
exports.createMemory = async (req, res) => {
  try {
    const { title, description, date, mood, location, weather } = req.body;

    // Basic validation (important)
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const memory = await Memory.create({
      user: req.user.id,
      title: title.trim(),
      description: description.trim(),
      date: date || new Date(),
      mood,
      location,
      weather
    });

    res.status(201).json({ memory });
  } catch (err) {
    console.error("CREATE ERROR:", err); // 🔥 debug
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/memories/:id
exports.updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json({ memory });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/memories/:id
exports.deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!memory) return res.status(404).json({ message: 'Memory not found' });
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/memories/:id/favorite
// ── Replace your existing toggleFavorite ───────────────────────

// ── Replace your existing toggleFavorite ───────────────────────

exports.toggleFavorite = async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    memory.isFavorite = !memory.isFavorite;

    await memory.save();

    res.json({ memory });

  } catch (err) {
    console.error("TOGGLE ERROR:", err); // 👈 VERY IMPORTANT
    res.status(500).json({ message: err.message });
  }
};