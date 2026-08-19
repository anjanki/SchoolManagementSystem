const express = require('express');
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create result (admin only)
router.post('/', authorize('ADMIN'), resultController.createResult);

// Get all results (admin only)
router.get('/', authorize('ADMIN'), resultController.getAllResults);

// Get student results (student can view own, admin can view all)
router.get('/student/:studentId', resultController.getStudentResults);

// Update result (admin only)
router.put('/:id', authorize('ADMIN'), resultController.updateResult);

// Delete result (admin only)
router.delete('/:id', authorize('ADMIN'), resultController.deleteResult);

module.exports = router;
