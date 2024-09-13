import mongoose from 'mongoose';
const { Schema } = mongoose;

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    academianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Academian', required: true },
    date: {
        day: { type: String, required: true },
        slot: { type: String, required: true },
      },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    description: { type: String }
  });
  

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
export default AppointmentModel;
