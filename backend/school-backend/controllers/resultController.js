const Result = require('../models/Result');
const Student = require('../models/Student');

// Create result
exports.createResult = async (req, res) => {
  try {
    const { studentId, examId, exam, subject, marksObtained, maximumMarks, remarks } = req.body;

    if (!studentId || !exam || !subject || marksObtained === undefined) {
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

    const result = new Result({
      studentId,
      examId,
      className: student.className,
      section: student.section,
      academicYear: student.academicYear,
      exam,
      subject,
      marksObtained,
      maximumMarks: maximumMarks || 100,
      remarks
    });

    await result.save();

    res.status(201).json({
      success: true,
      message: 'Result created successfully',
      data: { result }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get student results
exports.getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear, exam, page = 1, limit = 10 } = req.query;

    let query = { studentId };
    if (academicYear) query.academicYear = academicYear;
    if (exam) query.exam = exam;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await Result.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Result.countDocuments(query);

    // Calculate average
    const totalMarks = results.reduce((sum, r) => sum + r.marksObtained, 0);
    const totalMaxMarks = results.reduce((sum, r) => sum + r.maximumMarks, 0);
    const averagePercentage = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      message: 'Results fetched successfully',
      data: {
        results,
        statistics: {
          totalSubjects: results.length,
          totalMarks,
          totalMaxMarks,
          averagePercentage
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

// Get all results
exports.getAllResults = async (req, res) => {
  try {
    const { className, exam, academicYear, search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (className) query.className = className;
    if (exam) query.exam = exam;
    if (academicYear) query.academicYear = academicYear;

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await Result.find(query)
      .populate('studentId', 'firstName lastName studentId className')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Result.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Results fetched successfully',
      data: {
        results,
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

// Update result
exports.updateResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Result updated successfully',
      data: { result }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete result
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
