import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true';

let transporter = null;

if (EMAIL_ENABLED) {
  console.log('Email Config Debug:');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  console.log('Email notifications are disabled. Set EMAIL_ENABLED=true in .env to enable.');
}

/**
 * Send appointment approval email to patient
 */
export const sendAppointmentApprovalEmail = async (patientEmail, patientName, doctorName, appointmentDate, timeSlot) => {
  if (!EMAIL_ENABLED || !transporter) {
    console.log('Email disabled, skipping approval email to:', patientEmail);
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || '"CureSync" <noreply@curesync.com>',
      to: patientEmail,
      subject: 'Appointment Confirmed - CureSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">CureSync</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your AI-Powered Health Partner</p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Appointment Confirmed! ✅</h2>

            <p style="color: #555; line-height: 1.6;">Dear <strong>${patientName}</strong>,</p>

            <p style="color: #555; line-height: 1.6;">Your appointment has been successfully confirmed. Here are the details:</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="margin: 10px 0; color: #333;"><strong>Doctor:</strong> ${doctorName}</p>
              <p style="margin: 10px 0; color: #333;"><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="margin: 10px 0; color: #333;"><strong>Time:</strong> ${timeSlot}</p>
            </div>

            <p style="color: #555; line-height: 1.6;">Please arrive 10 minutes before your scheduled appointment time. If you need to reschedule or cancel, please contact us.</p>

            <p style="color: #555; line-height: 1.6;">Thank you for choosing CureSync for your healthcare needs.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="color: #888; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment approval email sent to:', patientEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

/**
 * Send appointment cancellation email to patient
 */
export const sendAppointmentCancellationEmail = async (patientEmail, patientName, doctorName, appointmentDate, timeSlot) => {
  if (!EMAIL_ENABLED || !transporter) {
    console.log('Email disabled, skipping cancellation email to:', patientEmail);
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || '"CureSync" <noreply@curesync.com>',
      to: patientEmail,
      subject: 'Appointment Cancelled - CureSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">CureSync</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your AI-Powered Health Partner</p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Appointment Cancelled ❌</h2>

            <p style="color: #555; line-height: 1.6;">Dear <strong>${patientName}</strong>,</p>

            <p style="color: #555; line-height: 1.6;">Your appointment has been cancelled. Here were the details:</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
              <p style="margin: 10px 0; color: #333;"><strong>Doctor:</strong> ${doctorName}</p>
              <p style="margin: 10px 0; color: #333;"><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="margin: 10px 0; color: #333;"><strong>Time:</strong> ${timeSlot}</p>
            </div>

            <p style="color: #555; line-height: 1.6;">We apologize for any inconvenience. Please book a new appointment at your convenience.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="color: #888; font-size: 12px; margin: 0;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment cancellation email sent to:', patientEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
