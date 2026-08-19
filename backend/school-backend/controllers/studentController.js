const Student = require('../models/Student');
const User = require('../models/User');
const Admission = require('../models/Admission');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');

// Get all students with search, filter, sort, pagination
exports.getAllStudents = async (req, res) => {
  try {
    const { search, className, section, status, sort, page = 1, limit = 10 } = req.query;
    
    let query = {};

    // Search
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter
    if (className) query.className = className;
    if (section) query.section = section;
    if (status) query.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    let sortQuery = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split(':');
      sortQuery = { [field]: order === 'desc' ? -1 : 1 };
    }

    const students = await Student.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data: {
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          limit: parseInt(limit)
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

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student fetched successfully',
      data: { student }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create student (used by admission approval)
exports.createStudent = async (req, res) => {
  try {
    const { userId, firstName, lastName, email, phone, className, section, rollNumber, academicYear } = req.body;

    if (!userId || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    // Generate unique student ID
    const count = await Student.countDocuments();
    const studentId = `STU${String(count + 1).padStart(6, '0')}`;

    const student = new Student({
      userId,
      studentId,
      firstName,
      lastName,
      email,
      phone,
      className,
      section,
      rollNumber,
      academicYear,
      status: 'Active'
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { student }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: { student }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Optionally delete associated user account
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get student dashboard data
exports.getStudentDashboard = async (req, res) => {
  try {
    const studentUserId = req.user.id;
    const student = await Student.findOne({ userId: studentUserId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const [admissions, attendance, results, fees, notices] = await Promise.all([
      Admission.find({ $or: [{ userId: req.user.id }, { studentId: student._id }] }).sort({ createdAt: -1 }),
      Attendance.find({ studentId: student._id }).sort({ date: -1 }).limit(30),
      Result.find({ studentId: student._id }).sort({ createdAt: -1 }).limit(10),
      Fee.find({ studentId: student._id }).sort({ createdAt: -1 }).limit(10),
      Notice.find({ published: true }).sort({ publishedDate: -1, createdAt: -1 }).limit(5)
    ]);

    res.status(200).json({
      success: true,
      message: 'Student dashboard data fetched',
      data: { student, admissions, attendance, results, fees, notices }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Return only the authenticated student's profile.
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).select(
      'studentId firstName lastName email phone dateOfBirth gender bloodGroup address city state pinCode className section status academicYear'
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const latestAdmission = await Admission.findOne({
      userId: req.user.id
    }).sort({ createdAt: -1 }).select('applicationId status applyingClass submittedAt rejectionReason');

    res.status(200).json({
      success: true,
      message: 'Student profile fetched successfully',
      data: { student, admission: latestAdmission || null }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
