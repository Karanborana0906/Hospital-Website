import { createReport, fetchUserReports, fetchAllReports, fetchDoctorReports } from '../services/reportService.js';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';


// @desc    Upload a new medical report
// @route   POST /api/reports
// @access  Private
export const uploadReport = async (req, res) => {
  const { title, description, doctorId } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const createdReport = await createReport({
      patientId: req.user._id,
      title,
      description,
      doctorId: doctorId || null,
      filePath: `/${req.file.path.replace(/\\/g, '/')}`, // Normalize path for windows
    });

    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's reports
// @route   GET /api/reports
// @access  Private
export const getMyReports = async (req, res) => {
  try {
    const reports = await fetchUserReports(req.user._id);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reports (Super Admin)
// @route   GET /api/reports/admin
// @access  Private/Admin
export const getAllReports = async (req, res) => {
  try {
    const reports = await fetchAllReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get doctor specific reports (Assigned patients)
// @route   GET /api/reports/doctor
// @access  Private/Doctor
export const getDoctorReports = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
        if (['doctor', 'admin'].includes(req.user.role)) {
            doctor = await Doctor.create({
                userId: req.user._id,
                specialization: 'General Practice',
                experience: 0,
                fees: 0,
                city: req.user.city || 'Unknown',
                about: `Profile for ${req.user.name}`
            });
        } else {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
    }

    
    // Find all patients who have appointments with this doctor
    const appointments = await Appointment.find({ doctorId: doctor._id }).distinct('patientId');
    const reports = await fetchDoctorReports(appointments);
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

