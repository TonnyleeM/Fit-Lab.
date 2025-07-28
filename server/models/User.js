const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: {
    type: Number,
    required: false,
    min: 13,
    max: 120
  },
  fitnessGoal: {
    type: String,
    required: false,
    enum: ['lose-weight', 'build-muscle', 'maintain-fitness', 'improve-endurance', 'general-health']
  },
  experience: {
    type: String,
    required: false,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  workoutTime: {
    type: String,
    required: false,
    enum: ['15-30', '30-45', '45-60', '60+']
  },
  dietaryPreference: {
    type: String,
    required: false,
    enum: ['omnivore', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);