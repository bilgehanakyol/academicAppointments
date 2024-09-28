import mongoose from 'mongoose';
const { Schema } = mongoose;

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    academianId: { type: mongoose.Schema.Types.ObjectId, ref: 'Academian', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, 
              enum: ['pending', 'confirmed', 'cancelled'],
              default: 'pending' },
    description: { type: String },
    isAvailable: { type: Boolean, default: true }
  });
  

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
export default AppointmentModel;
