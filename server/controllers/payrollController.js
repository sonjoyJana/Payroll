const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

const getPayrolls = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    let query = {};
    if (employeeId) query.employee = employeeId;
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    const payrolls = await Payroll.find(query)
      .populate('employee', 'firstName lastName department position salary')
      .sort({ year: -1, month: -1 });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const existing = await Payroll.findOne({ employee: employeeId, month, year });
    if (existing) {
      return res.status(400).json({ message: 'Payroll already generated for this period' });
    }
    const startDate = new Date(year, new Date(Date.parse(month + " 1, " + year)).getMonth(), 1);
    const endDate = new Date(year, new Date(Date.parse(month + " 1, " + year)).getMonth() + 1, 0);
    const totalDays = endDate.getDate();
    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      date: { $gte: startDate, $lte: endDate },
    });
    const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
    const halfDays = attendanceRecords.filter(r => r.status === 'half-day').length;
    const totalPresent = presentDays + halfDays * 0.5;
    const allowances = 2000;
    const deductionRate = employee.salary / totalDays;
    const deductionDays = totalDays - totalPresent;
    const deductions = Math.round(deductionDays * deductionRate * 0.5);
    const tax = Math.round(employee.salary * 0.05);
    const netSalary = employee.salary + allowances - deductions - tax;
    const payroll = await Payroll.create({
      employee: employeeId,
      month,
      year: parseInt(year),
      basicSalary: employee.salary,
      allowances,
      deductions,
      tax,
      netSalary,
      workingDays: totalDays,
      presentDays: Math.floor(totalPresent),
    });
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePayrollStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status, paymentDate: status === 'paid' ? new Date() : undefined },
      { new: true }
    );
    if (payroll) {
      res.json(payroll);
    } else {
      res.status(404).json({ message: 'Payroll record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    const totalPresentToday = await Attendance.countDocuments({
      date: new Date().toISOString().split('T')[0],
      status: 'present',
    });
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    const monthlyPayroll = await Payroll.aggregate([
      { $match: { month: new Date().toLocaleString('default', { month: 'long' }), year: new Date().getFullYear() } },
      { $group: { _id: null, total: { $sum: '$netSalary' } } },
    ]);
    const recentPayrolls = await Payroll.find()
      .populate('employee', 'firstName lastName department')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      totalEmployees,
      totalPresentToday,
      pendingLeaves,
      monthlyPayrollTotal: monthlyPayroll[0]?.total || 0,
      recentPayrolls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPayrolls, generatePayroll, updatePayrollStatus, getDashboardStats };
