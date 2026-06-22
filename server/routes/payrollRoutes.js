const express = require('express');
const {
  getPayrolls,
  generatePayroll,
  updatePayrollStatus,
  getDashboardStats,
} = require('../controllers/payrollController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.route('/')
  .get(protect, getPayrolls)
  .post(protect, adminOnly, generatePayroll);

router.route('/:id')
  .put(protect, adminOnly, updatePayrollStatus);

module.exports = router;
