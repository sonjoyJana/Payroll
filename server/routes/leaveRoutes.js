const express = require('express');
const { getLeaves, applyLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getLeaves)
  .post(protect, applyLeave);

router.route('/:id')
  .put(protect, adminOnly, updateLeaveStatus);

module.exports = router;
