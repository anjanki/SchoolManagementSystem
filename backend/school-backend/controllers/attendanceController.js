const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Create/Update attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;

    if (!studentId || !date || !status) {
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

    // Check if attendance already exists for this date
    let attendance = await Attendance.findOne({
      studentId,
      date: new Date(date).toDateString()
    });

    if (attendance) {
      attendance.status = status;
      attendance.remarks = remarks;
      attendance.markedBy = req.user.id;
    } else {
      attendance = new Attendance({
        studentId,
        className: student.className,
        section: student.section,
        date: new Date(date),
        status,
        remarks,
        markedBy: req.user.id
      });
    }

    await attendance.save();

    res.status(attendance.isNew ? 201 : 200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: { attendance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get attendance by student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { fromDate, toDate, page = 1, limit = 10 } = req.query;

    let query = { studentId };

    if (fromDate && toDate) {
      query.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    // Calculate statistics
    const presentDays = await Attendance.countDocuments({ ...query, status: 'Present' });
    const absentDays = await Attendance.countDocuments({ ...query, status: 'Absent' });
    const attendancePercentage = total > 0 ? ((presentDays / total) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      message: 'Attendance fetched successfully',
      data: {
        attendance,
        statistics: {
          totalDays: total,
          presentDays,
          absentDays,
          attendancePercentage
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

// Get all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const { className, section, date, status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (className) query.className = className;
    if (section) query.section = section;
    if (status) query.status = status;
    if (date) {
      query.date = {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lte: new Date(date).setHours(23, 59, 59, 999)
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attendance = await Attendance.find(query)
      .populate('studentId', 'firstName lastName studentId')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Attendance fetched successfully',
      data: {
        attendance,
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
