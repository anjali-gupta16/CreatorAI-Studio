const mongoose = require('mongoose');

const savedContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['caption', 'idea', 'bio', 'viral-analysis'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient user queries
savedContentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SavedContent', savedContentSchema);
