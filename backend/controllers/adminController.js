import User from '../models/userModel.js';
import Doctor from '../models/doctorModel.js';
import LoginLog from '../models/loginLogModel.js';
import Appointment from '../models/appointmentModel.js';
import Medicine from '../models/medicineModel.js';
import Report from '../models/reportModel.js';

// @desc    Get system stats for super admin
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    
    const totalLogins = await LoginLog.countDocuments();
    const totalMedicines = await Medicine.countDocuments();
    const totalReports = await Report.countDocuments();
    
    // Today's logins
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogins = await LoginLog.countDocuments({ 
        loginTime: { $gte: today } 
    });

    // Active users (last 24 hours)
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await LoginLog.distinct('userId', {
        loginTime: { $gte: last24h }
    });

    const totalAppointments = await Appointment.countDocuments();

    // Calculate 7-day trend (for Chart)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trendData = await LoginLog.aggregate([
        { $match: { loginTime: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$loginTime" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalLogins,
      todayLogins,
      activeUsersCount: activeUsers.length,
      totalAppointments,
      totalMedicines,
      totalReports,
      trendData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Get login history logs
// @route   GET /api/admin/login-logs
// @access  Private/Admin
export const getLoginLogs = async (req, res) => {
  try {
    const logs = await LoginLog.find()
      .populate('userId', 'name email')
      .sort({ loginTime: -1 })
      .limit(50); // Limit to last 50 for performance
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
