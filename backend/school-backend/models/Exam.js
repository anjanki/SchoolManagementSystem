const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true
  },
  className: String,
  section: String,
  subject: String,
  examDate: Date,
  startTime: String,
  endTime: String,
  totalMarks: {
    type: Number,
    default: 100
  },
  passingMarks: {
    type: Number,
    default: 35
  },
  academicYear: String,
  examType: {
    type: String,
    enum: ['Unit Test', 'Semester', 'Annual', 'Half Yearly'],
    default: 'Unit Test'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  room: String,
  invigilator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
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
examSchema.index({ className: 1 });
examSchema.index({ examDate: 1 });
examSchema.index({ academicYear: 1 });
examSchema.index({ status: 1 });

module.exports = mongoose.model('Exam', examSchema);
