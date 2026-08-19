const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  className: String,
  section: String,
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    required: true
  },
  remarks: String,
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
attendanceSchema.index({ studentId: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ className: 1 });
attendanceSchema.index({ section: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
