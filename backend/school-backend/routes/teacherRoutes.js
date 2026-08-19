const express = require('express');
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Public route
router.get('/', teacherController.getAllTeachers);

// Get teacher by ID
router.get('/:id', teacherController.getTeacherById);

// Protected routes - admin only
router.use(authMiddleware);
router.use(authorize('ADMIN'));

// Create teacher (admin only)
router.post('/', teacherController.createTeacher);

// Update teacher (admin only)
router.put('/:id', teacherController.updateTeacher);

// Delete teacher (admin only)
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
