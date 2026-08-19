const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/admin-login', authController.adminLogin);
router.post('/student-login', authController.studentLogin);
router.post('/student-register', authController.registerStudent);

// Protected routes
router.get('/verify-token', authMiddleware, authController.verifyToken);

module.exports = router;
