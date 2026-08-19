const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  className: String,
  section: String,
  academicYear: String,
  month: String,
  totalFee: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  pendingAmount: {
    type: Number,
    computed: function() {
      return this.totalFee - this.paidAmount;
    }
  },
  status: {
    type: String,
    enum: ['PAID', 'PARTIAL', 'PENDING'],
    default: 'PENDING'
  },
  dueDate: Date,
  paidDate: Date,
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Cheque'],
    default: 'Cash'
  },
  transactionId: String,
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

// Pre-save hook to update status based on payment
feeSchema.pre('save', function(next) {
  if (this.paidAmount === 0) {
    this.status = 'PENDING';
  } else if (this.paidAmount < this.totalFee) {
    this.status = 'PARTIAL';
  } else {
    this.status = 'PAID';
  }
  next();
});

// Create indexes
feeSchema.index({ studentId: 1 });
feeSchema.index({ className: 1 });
feeSchema.index({ status: 1 });
feeSchema.index({ academicYear: 1 });

module.exports = mongoose.model('Fee', feeSchema);
