import { fetchAllDoctors, fetchDoctorById } from '../services/doctorService.js';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import Report from '../models/reportModel.js';


// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req, res) => {
  try {
    const doctors = await fetchAllDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await fetchDoctorById(req.params.id);
    
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get doctor dashboard stats
// @route   GET /api/doctors/stats
// @access  Private/Doctor
export const getDoctorStats = async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor) {
      // If user has the role but no profile, create a default one (Self-healing)
      if (['doctor', 'admin'].includes(req.user.role)) {
        doctor = await Doctor.create({
          userId: req.user._id,
          specialization: 'General Practice',
          experience: 0,
          fees: 0,
          city: req.user.city || 'Unknown',
          about: `Default profile for ${req.user.name}`
        });
      } else {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
    }


    const upcomingAppointments = await Appointment.countDocuments({ 
        doctorId: doctor._id,
        status: { $in: ['pending', 'approved'] }
    });

    const totalPatients = (await Appointment.find({ doctorId: doctor._id }).distinct('patientId')).length;

    // Find reports for this doctor's patients
    const patientIds = await Appointment.find({ doctorId: doctor._id }).distinct('patientId');
    const pendingReports = await Report.countDocuments({ 
        patientId: { $in: patientIds }
    });

    res.json({
      upcomingAppointments,
      totalPatients,
      pendingReports
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user._id });

    if (doctor) {
      doctor.specialization = req.body.specialization || doctor.specialization;
      doctor.experience = req.body.experience || doctor.experience;
      doctor.fees = req.body.fees || doctor.fees;
      doctor.about = req.body.about || doctor.about;
      doctor.availableDays = req.body.availableDays || doctor.availableDays;
      doctor.availableTime = req.body.availableTime || doctor.availableTime;
      doctor.city = req.body.city || doctor.city;
      doctor.location = req.body.location || doctor.location;

      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      res.status(404).json({ message: 'Doctor profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get doctor by User ID (for profile view)
// @route   GET /api/doctors/user/:userId
// @access  Public
export const getDoctorByUserId = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.params.userId }).populate('userId', 'name email city role');
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


