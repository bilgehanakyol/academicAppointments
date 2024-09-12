import mongoose from 'mongoose';
const { Schema } = mongoose;

const CalendarSlotSchema = new Schema({
  calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar', required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

const CalendarSlotModel = mongoose.model('CalendarSlot', CalendarSlotSchema);
export default CalendarSlotModel;
