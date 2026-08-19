const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Mark attendance (admin only)
router.post('/', authorize('ADMIN'), attendanceController.markAttendance);

// Get all attendance (admin only)
router.get('/', authorize('ADMIN'), attendanceController.getAllAttendance);

// Get student attendance (student can view own, admin can view all)
router.get('/student/:studentId', attendanceController.getStudentAttendance);

module.exports = router;
