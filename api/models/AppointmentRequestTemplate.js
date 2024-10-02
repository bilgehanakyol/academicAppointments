import mongoose from 'mongoose';
const { Schema } = mongoose;

const appointmentRequestTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const AppointmentRequestTemplateModel = mongoose.model('AppointmentRequestTemplateModel', appointmentRequestTemplateSchema);

export default AppointmentRequestTemplateModel;