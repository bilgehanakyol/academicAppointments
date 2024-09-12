import mongoose from 'mongoose';
const { Schema } = mongoose;

const CalendarSchema = new Schema({
  academian: { type: mongoose.Schema.Types.ObjectId, ref: 'Academian', required: true },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
    slots: [{ date: { type: String, default: '' }, isAvailable: { type: Boolean, default: true } }]
  }],
});

const CalendarModel = mongoose.model('Calendar', CalendarSchema);
export default CalendarModel;
