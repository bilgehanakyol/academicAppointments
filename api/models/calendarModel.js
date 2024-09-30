import mongoose from 'mongoose';
const { Schema } = mongoose;

const CalendarSchema = new Schema({
  academian: { type: mongoose.Schema.Types.ObjectId, ref: 'Academian', required: true },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
    slots: [{ 
      start: { type: String, required: true }, 
      end: { type: String, required: true },   
      isAvailable: { type: Boolean, default: true }
    }]
  }],
}, { timestamps: true });

const CalendarModel = mongoose.model('Calendar', CalendarSchema);
export default CalendarModel;