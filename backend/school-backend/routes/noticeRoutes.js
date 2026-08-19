const express = require('express');
const noticeController = require('../controllers/noticeController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Public route - get published notices
router.get('/', noticeController.getAllNotices);

// Get notice by ID (public)
router.get('/:id', noticeController.getNoticeById);

// Protected routes - admin only
router.use(authMiddleware);
router.use(authorize('ADMIN'));

// Create notice (admin only)
router.post('/', noticeController.createNotice);

// Publish notice (admin only)
router.put('/:id/publish', noticeController.publishNotice);

// Update notice (admin only)
router.put('/:id', noticeController.updateNotice);

// Delete notice (admin only)
router.delete('/:id', noticeController.deleteNotice);

module.exports = router;
