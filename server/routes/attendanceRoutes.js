const express = require('express');
const { getAttendance, markAttendance, updateAttendance } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getAttendance)
  .post(protect, adminOnly, markAttendance);

router.route('/:id')
  .put(protect, adminOnly, updateAttendance);

module.exports = router;
