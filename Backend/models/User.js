const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'],
    trim: true, maxlength: [50, 'Name too long']
  },
  email: {
    type: String, required: [true, 'Email is required'],
    unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  password: {
    type: String, required: [true, 'Password is required'],
    minlength: [6, 'Min 6 characters'], select: false
  },
  avatar: { type: String, default: '' },
  preferences: {
    theme: { type: String, enum: ['light','dark'], default: 'light' },
    accentColor: { type: String, default: '#b8823a' },
    font: { type: String, default: 'DM Sans' }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePass) {
  return bcrypt.compare(candidatePass, this.password);
};

module.exports = mongoose.model('User', userSchema);