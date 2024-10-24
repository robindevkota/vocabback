const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audioUrl: {
    type: String
  },
  pronunciation: {
    type: String
  },
  partsOfSpeech: {
    type: String
  },
  meanings: {
    type: String, // Optional: a string field for user-customized meanings
  },
  examples: {
    type: String, // Adding a field for user-customized examples
  },
  originalMeanings: [{
    type: Object
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Word', wordSchema);
