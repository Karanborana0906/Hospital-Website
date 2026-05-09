import Report from '../models/reportModel.js';

/**
 * Service to handle Medical Report operations
 */
export const createReport = async (reportData) => {
  const report = new Report(reportData);
  return await report.save();
};

export const fetchUserReports = async (userId) => {
  return await Report.find({ patientId: userId })
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name' }
    })
    .sort({ uploadDate: -1 });
};

export const fetchAllReports = async () => {
  return await Report.find({})
    .populate('patientId', 'name email')
    .populate({
      path: 'doctorId',
      populate: { path: 'userId', select: 'name' }
    })
    .sort({ uploadDate: -1 });
};

export const fetchDoctorReports = async (patientIds) => {
  return await Report.find({ patientId: { $in: patientIds } })
    .populate('patientId', 'name email')
    .sort({ uploadDate: -1 });
};

export const fetchReportById = async (id) => {
  return await Report.findById(id);
};
