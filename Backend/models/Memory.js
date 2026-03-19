const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title too long']
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ''
  },
  mood: {
    type: String,
    enum: ['happy', 'grateful', 'nostalgic', 'peaceful', 'sad', 'excited'],
    default: 'happy'
  },
  tags: {
    type: [String],
    default: []
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  images: [
  {
    url: String,
    caption: String
  }
],
video: {
  url: String
},
audio: {
  url: String
},
music: {
  url: String
},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Memory', memorySchema);