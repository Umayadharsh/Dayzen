const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getMemories, getMemory, createMemory,
  updateMemory, deleteMemory, toggleFavorite
} = require('../controllers/memoryController');

router.use(protect); // all routes require auth

router.route('/')
  .get(getMemories)
  .post(createMemory);

router.route('/:id')
  .get(getMemory)
  .patch(updateMemory)
  .delete(deleteMemory);

router.patch('/:id/favorite', toggleFavorite);

module.exports = router;