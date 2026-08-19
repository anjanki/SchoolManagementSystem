const express = require('express');
const admissionController = require('../controllers/admissionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authMiddleware);

// Student admission APIs
router.post('/', authorize('STUDENT'), admissionController.createAdmission);
router.get('/', authorize('ADMIN'), admissionController.getAllAdmissions);

// Get admission by ID (admin only)
router.get('/:id', authorize('ADMIN'), admissionController.getAdmissionById);

// Approve admission (admin only)
router.put('/:id/approve', authorize('ADMIN'), admissionController.approveAdmission);

// Reject admission (admin only)
router.put('/:id/reject', authorize('ADMIN'), admissionController.rejectAdmission);

module.exports = router;
