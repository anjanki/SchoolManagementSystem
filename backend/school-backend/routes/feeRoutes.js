const express = require('express');
const feeController = require('../controllers/feeController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create fee (admin only)
router.post('/', authorize('ADMIN'), feeController.createFee);

// Get all fees (admin only)
router.get('/', authorize('ADMIN'), feeController.getAllFees);

// Get student fees (student can view own, admin can view all)
router.get('/student/:studentId', feeController.getStudentFees);

// Record payment (admin only)
router.put('/:id/payment', authorize('ADMIN'), feeController.recordPayment);

// Update fee (admin only)
router.put('/:id', authorize('ADMIN'), feeController.updateFee);

// Delete fee (admin only)
router.delete('/:id', authorize('ADMIN'), feeController.deleteFee);

module.exports = router;
