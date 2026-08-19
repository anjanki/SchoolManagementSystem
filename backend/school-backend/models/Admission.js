const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  applyingClass: String,
  email: {
    type: String,
    required: true
  },
  phone: String,
  address: String,
  city: String,
  state: String,
  pinCode: String,
  fatherName: String,
  fatherOccupation: String,
  motherName: String,
  motherOccupation: String,
  guardianName: String,
  guardianPhone: String,
  guardianEmail: String,
  guardianOccupation: String,
  board: String,
  previousSchool: String,
  previousClass: String,
  previousPercentage: Number,
  academicYear: String,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  approvalDate: Date,
  rejectionReason: String,
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  documents: {
    photo: String,
    birthCertificate: String,
    previousMarksheet: String
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
admissionSchema.index({ applicationId: 1 });
admissionSchema.index({ status: 1 });
admissionSchema.index({ email: 1 });
admissionSchema.index({ applyingClass: 1 });

module.exports = mongoose.model('Admission', admissionSchema);
