import { fetchUserAppointments, createAppointment, fetchAllAppointments, fetchDoctorAppointments } from '../services/appointmentService.js';
import Doctor from '../models/doctorModel.js';
import Appointment from '../models/appointmentModel.js';
import { sendAppointmentApprovalEmail, sendAppointmentCancellationEmail } from '../utils/sendEmail.js';
import User from '../models/userModel.js';



// @desc    Get all appointments for a user (patient)
// @route   GET /api/appointments
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await fetchUserAppointments(req.user._id);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
export const bookAppointment = async (req, res) => {
  const { doctorId, appointmentDate, timeSlot, reason } = req.body;

  if (!doctorId || doctorId === "") {
    return res.status(400).json({ message: 'Doctor selection is required' });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    let finalDate = new Date(appointmentDate);
    let dateShifted = false;
    let attempts = 0;
    const maxAttempts = 30; // Prevent infinite loop

    // Check daily appointment limit and shift to next day if needed
    while (attempts < maxAttempts) {
      const startOfDay = new Date(finalDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(finalDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Count approved appointments for this day
      const dailyCount = await Appointment.countDocuments({
        doctorId,
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        status: 'approved'
      });

      // Check if daily limit is reached
      if (dailyCount >= doctor.dailyAppointmentLimit) {
        // Shift to next day
        finalDate.setDate(finalDate.getDate() + 1);
        dateShifted = true;
        attempts++;
      } else {
        // Limit not reached, break the loop
        break;
      }
    }

    // Check if the time slot is already booked by checking existing approved appointments
    const startOfDay = new Date(finalDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(finalDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: 'approved'
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked. Please choose another time.' });
    }

    const createdAppointment = await createAppointment({
      patientId: req.user._id,
      doctorId,
      appointmentDate: finalDate,
      timeSlot,
      reason
    });

    // Include date shift information in response
    const response = createdAppointment.toObject();
    response.dateShifted = dateShifted;
    response.originalDate = appointmentDate;
    response.finalDate = finalDate;

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all appointments (Super Admin)
// @route   GET /api/appointments/admin
// @access  Private/Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await fetchAllAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get doctor specific appointments
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
export const getDoctorAppointments = async (req, res) => {
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
    const appointments = await fetchDoctorAppointments(doctor._id);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get repeat patients (patients with multiple appointments)
// @route   GET /api/appointments/repeat-patients
// @access  Private/Admin
export const getRepeatPatients = async (req, res) => {
  try {
    const appointments = await Appointment.aggregate([
      {
        $group: {
          _id: '$patientId',
          appointmentCount: { $sum: 1 },
          lastVisit: { $max: '$appointmentDate' },
          firstVisit: { $min: '$appointmentDate' }
        }
      },
      {
        $match: {
          appointmentCount: { $gte: 2 }
        }
      },
      {
        $sort: { appointmentCount: -1 }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'patient'
        }
      },
      {
        $unwind: '$patient'
      },
      {
        $project: {
          'patient.password': 0
        }
      }
    ]);

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Doctor/Admin
export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Permission check: Superadmin can do anything, Doctor can only update their own
    if (req.user.role !== 'superadmin') {
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this appointment' });
        }
    }

    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    // Send email notification
    if (status === 'approved') {
      try {
        const patient = await User.findById(appointment.patientId);
        const doctor = await Doctor.findById(appointment.doctorId).populate('userId', 'name');
        
        if (patient && doctor) {
          await sendAppointmentApprovalEmail(
            patient.email,
            patient.name,
            doctor.userId.name,
            appointment.appointmentDate,
            appointment.timeSlot
          );
        }
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't fail the request if email fails
      }
    } else if (status === 'cancelled') {
      try {
        const patient = await User.findById(appointment.patientId);
        const doctor = await Doctor.findById(appointment.doctorId).populate('userId', 'name');
        
        if (patient && doctor) {
          await sendAppointmentCancellationEmail(
            patient.email,
            patient.name,
            doctor.userId.name,
            appointment.appointmentDate,
            appointment.timeSlot
          );
        }
      } catch (emailError) {
        console.error('Error sending cancellation email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


