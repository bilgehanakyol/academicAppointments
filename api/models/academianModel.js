import mongoose from 'mongoose';
const { Schema } = mongoose;

const academianSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: { type: String, default: 'academian' },
  department: String,
  calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' }
});

const AcademianModel = mongoose.model('Academian', academianSchema);
export default AcademianModel;
