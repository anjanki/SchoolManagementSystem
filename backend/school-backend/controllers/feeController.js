const Fee = require('../models/Fee');
const Student = require('../models/Student');

// Create fee record
exports.createFee = async (req, res) => {
  try {
    const { studentId, month, totalFee, dueDate, paymentMethod } = req.body;

    if (!studentId || !month || !totalFee) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const fee = new Fee({
      studentId,
      className: student.className,
      section: student.section,
      academicYear: student.academicYear,
      month,
      totalFee,
      dueDate,
      paymentMethod,
      status: 'PENDING'
    });

    await fee.save();

    res.status(201).json({
      success: true,
      message: 'Fee record created successfully',
      data: { fee }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get student fees
exports.getStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { studentId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const fees = await Fee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Fee.countDocuments(query);

    // Calculate totals
    const totalFeeAmount = fees.reduce((sum, f) => sum + f.totalFee, 0);
    const totalPaidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
    const totalPendingAmount = totalFeeAmount - totalPaidAmount;

    res.status(200).json({
      success: true,
      message: 'Fees fetched successfully',
      data: {
        fees,
        summary: {
          totalFeeAmount,
          totalPaidAmount,
          totalPendingAmount
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all fees
exports.getAllFees = async (req, res) => {
  try {
    const { className, status, academicYear, search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (className) query.className = className;
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const fees = await Fee.find(query)
      .populate('studentId', 'firstName lastName studentId className')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Fee.countDocuments(query);

    // Calculate collection statistics
    const totalFeeAmount = fees.reduce((sum, f) => sum + f.totalFee, 0);
    const totalPaidAmount = fees.reduce((sum, f) => sum + f.paidAmount, 0);
    const collectionPercentage = totalFeeAmount > 0 ? ((totalPaidAmount / totalFeeAmount) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      message: 'Fees fetched successfully',
      data: {
        fees,
        summary: {
          totalFeeAmount,
          totalPaidAmount,
          totalPendingAmount: totalFeeAmount - totalPaidAmount,
          collectionPercentage
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Record payment
exports.recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod, transactionId } = req.body;

    if (!paidAmount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount is required'
      });
    }

    const fee = await Fee.findById(id);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    fee.paidAmount = (fee.paidAmount || 0) + paidAmount;
    fee.paidDate = new Date();
    if (paymentMethod) fee.paymentMethod = paymentMethod;
    if (transactionId) fee.transactionId = transactionId;

    // Update status based on payment
    if (fee.paidAmount >= fee.totalFee) {
      fee.status = 'PAID';
    } else if (fee.paidAmount > 0) {
      fee.status = 'PARTIAL';
    }

    await fee.save();

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { fee }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update fee
exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fee updated successfully',
      data: { fee }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete fee
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
