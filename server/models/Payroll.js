const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  netSalary: {
    type: Number,
    required: true,
  },
  workingDays: {
    type: Number,
    default: 0,
  },
  presentDays: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'paid'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
  },
}, { timestamps: true });

payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);
