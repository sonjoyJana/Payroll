const express = require('express');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getEmployees)
  .post(protect, adminOnly, createEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, adminOnly, updateEmployee)
  .delete(protect, adminOnly, deleteEmployee);

module.exports = router;
