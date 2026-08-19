const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admission = require('../models/Admission');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Result = require('../models/Result');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    console.log('⏱️ Starting dashboard stats query...');
    const startTime = Date.now();

    // Count statistics
    console.log('📊 Counting students...');
    const totalStudents = await Student.countDocuments({ status: 'Active' });
    console.log(`✓ Students: ${totalStudents} (${Date.now() - startTime}ms)`);

    console.log('📊 Counting teachers...');
    const totalTeachers = await Teacher.countDocuments({ status: 'Active' });
    console.log(`✓ Teachers: ${totalTeachers} (${Date.now() - startTime}ms)`);

    console.log('📊 Counting admissions...');
    const pendingAdmissions = await Admission.countDocuments({ status: 'PENDING' });
    const approvedAdmissions = await Admission.countDocuments({ status: 'APPROVED' });
    console.log(`✓ Admissions - Pending: ${pendingAdmissions}, Approved: ${approvedAdmissions} (${Date.now() - startTime}ms)`);

    // Attendance data
    console.log('📊 Fetching attendance data...');
    const today = new Date().toDateString();
    const todayAttendance = await Attendance.find({
      date: {
        $gte: new Date(today),
        $lt: new Date(new Date(today).getTime() + 86400000)
      }
    });
    const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
    const attendancePercentage = todayAttendance.length > 0
      ? ((presentCount / todayAttendance.length) * 100).toFixed(2)
      : 0;
    console.log(`✓ Attendance: ${presentCount}/${todayAttendance.length} (${Date.now() - startTime}ms)`);

    // Fee statistics
    console.log('📊 Aggregating fee data...');
    const feeRecords = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalFees: { $sum: '$totalFee' },
          totalPaid: { $sum: '$paidAmount' }
        }
      }
    ]);

    const totalFees = feeRecords[0]?.totalFees || 0;
    const totalFeePaid = feeRecords[0]?.totalPaid || 0;
    const totalFeePending = totalFees - totalFeePaid;
    console.log(`✓ Fees - Total: ${totalFees}, Paid: ${totalFeePaid} (${Date.now() - startTime}ms)`);

    // Students by class
    console.log('📊 Grouping students by class...');
    const studentsByClass = await Student.aggregate([
      {
        $group: {
          _id: '$className',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    console.log(`✓ Students by class: ${studentsByClass.length} classes (${Date.now() - startTime}ms)`);

    // Admission status
    console.log('📊 Grouping admissions by status...');
    const admissionStatus = await Admission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    console.log(`✓ Admission status: ${admissionStatus.length} statuses (${Date.now() - startTime}ms)`);

    console.log(`✅ Dashboard stats completed in ${Date.now() - startTime}ms total`);

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: {
        kpis: {
          totalStudents,
          totalTeachers,
          pendingAdmissions,
          approvedAdmissions,
          attendancePercentage,
          totalFeePaid,
          totalFeePending
        },
        charts: {
          studentsByClass,
          admissionStatus
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get attendance report
exports.getAttendanceReport = async (req, res) => {
  try {
    const { className, fromDate, toDate } = req.query;

    let query = {};
    if (className) query.className = className;
    if (fromDate && toDate) {
      query.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }

    const attendance = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$studentId',
          presentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
          },
          absentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
          },
          leaveDays: {
            $sum: { $cond: [{ $eq: ['$status', 'Leave'] }, 1, 0] }
          },
          totalDays: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Attendance report fetched successfully',
      data: { attendance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get fee collection report
exports.getFeeCollectionReport = async (req, res) => {
  try {
    const { className, academicYear } = req.query;

    let query = {};
    if (className) query.className = className;
    if (academicYear) query.academicYear = academicYear;

    const feeReport = await Fee.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalFee' },
          paidAmount: { $sum: '$paidAmount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Fee collection report fetched successfully',
      data: { feeReport }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
