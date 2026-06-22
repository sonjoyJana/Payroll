const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

const getLeaves = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    let query = {};
    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;
    const leaves = await Leave.find(query)
      .populate('employee', 'firstName lastName department')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyLeave = async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, approvedBy: req.user._id },
      { new: true }
    );
    if (leave) {
      res.json(leave);
    } else {
      res.status(404).json({ message: 'Leave request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaves, applyLeave, updateLeaveStatus };
