import Appointment from '../models/appointmentModel.js';

/**
 * Service to handle Appointment operations
 */
export const fetchUserAppointments = async (userId) => {
  return await Appointment.find({ patientId: userId })
    .populate('doctorId', 'specialization fees about')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email profileImage'
      }
    });
};

export const createAppointment = async (appointmentData) => {
  const appointment = new Appointment(appointmentData);
  return await appointment.save();
};

export const fetchAllAppointments = async () => {
  return await Appointment.find({})
    .populate('patientId', 'name email city')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email'
      }
    }).sort({ appointmentDate: -1 });
};

export const fetchDoctorAppointments = async (doctorId) => {
  return await Appointment.find({ doctorId })
    .populate('patientId', 'name email city')
    .sort({ appointmentDate: 1 });
};

