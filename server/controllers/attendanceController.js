const Attendance = require('../models/Attendance');

const getAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, date, status } = req.query;
    let query = {};
    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      query.date = { $gte: new Date(d.setHours(0,0,0,0)), $lte: new Date(d.setHours(23,59,59,999)) };
    }
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName department')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, checkIn, checkOut, status } = req.body;
    const existing = await Attendance.findOne({ employee: employeeId, date: new Date(date) });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }
    const attendance = await Attendance.create({
      employee: employeeId,
      date,
      checkIn,
      checkOut,
      status,
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404).json({ message: 'Attendance record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAttendance, markAttendance, updateAttendance };
