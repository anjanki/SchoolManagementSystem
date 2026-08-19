const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: String,
  className: String,
  section: String,
  rollNumber: String,
  admissionDate: Date,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  fatherName: String,
  fatherOccupation: String,
  fatherPhone: String,
  motherName: String,
  motherOccupation: String,
  motherPhone: String,
  previousSchool: String,
  previousClass: String,
  previousPercentage: Number,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Graduated', 'Dropped Out'],
    default: 'Active'
  },
  academicYear: String,
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
studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ className: 1 });
studentSchema.index({ section: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ userId: 1 });

module.exports = mongoose.model('Student', studentSchema);
