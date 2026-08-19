const express = require('express');
const adminController = require('../controllers/adminController');
const admissionController = require('../controllers/admissionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware);
router.use(authorize('ADMIN'));

// Dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

// Admission review
router.get('/admissions', admissionController.getAllAdmissions);
router.get('/admissions/:id', admissionController.getAdmissionById);
router.put('/admissions/:id/approve', admissionController.approveAdmission);
router.put('/admissions/:id/reject', admissionController.rejectAdmission);

// Reports
router.get('/reports/attendance', adminController.getAttendanceReport);
router.get('/reports/fee-collection', adminController.getFeeCollectionReport);

module.exports = router;
