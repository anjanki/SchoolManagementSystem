const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const admissionController = require('../controllers/admissionController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Student admission applications
router.post('/admissions', authorize('STUDENT'), admissionController.createAdmission);
router.get('/admissions', authorize('STUDENT'), admissionController.getStudentAdmissions);
router.get('/admissions/:id', authorize('STUDENT'), admissionController.getStudentAdmissionById);
router.put('/admissions/:id', authorize('STUDENT'), admissionController.updateStudentAdmission);

// Get all students (admin only)
router.get('/', authorize('ADMIN'), studentController.getAllStudents);

// Get student dashboard (student only)
router.get('/dashboard', authorize('STUDENT'), studentController.getStudentDashboard);

// Get authenticated student profile (student only)
router.get('/profile', authorize('STUDENT'), studentController.getStudentProfile);

// Get student by ID
router.get('/:id', studentController.getStudentById);

// Create student (admin only - used by admission approval)
router.post('/', authorize('ADMIN'), studentController.createStudent);

// Update student (admin only)
router.put('/:id', authorize('ADMIN'), studentController.updateStudent);

// Delete student (admin only)
router.delete('/:id', authorize('ADMIN'), studentController.deleteStudent);

module.exports = router;
