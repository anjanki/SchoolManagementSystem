const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam'
  },
  className: String,
  section: String,
  academicYear: String,
  exam: String,
  subject: String,
  marksObtained: {
    type: Number,
    required: true
  },
  maximumMarks: {
    type: Number,
    default: 100
  },
  percentage: {
    type: Number,
    computed: function() {
      return (this.marksObtained / this.maximumMarks) * 100;
    }
  },
  grade: String,
  remarks: String,
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

// Pre-save hook to calculate grade
resultSchema.pre('save', function(next) {
  const percentage = (this.marksObtained / this.maximumMarks) * 100;
  
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B';
  else if (percentage >= 60) this.grade = 'C';
  else if (percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

// Create indexes
resultSchema.index({ studentId: 1 });
resultSchema.index({ examId: 1 });
resultSchema.index({ className: 1 });
resultSchema.index({ academicYear: 1 });

module.exports = mongoose.model('Result', resultSchema);
