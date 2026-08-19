const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  gender: String,
  dateOfBirth: Date,
  qualification: String,
  subject: String,
  department: String,
  joinDate: Date,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },
  experience: Number,
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
teacherSchema.index({ teacherId: 1 });
teacherSchema.index({ email: 1 });
teacherSchema.index({ subject: 1 });
teacherSchema.index({ status: 1 });

module.exports = mongoose.model('Teacher', teacherSchema);
