const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['General', 'Academic', 'Events', 'Holiday', 'Urgent'],
    default: 'General'
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedDate: Date,
  expiryDate: Date,
  attachmentUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes
noticeSchema.index({ published: 1 });
noticeSchema.index({ category: 1 });
noticeSchema.index({ publishedDate: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
