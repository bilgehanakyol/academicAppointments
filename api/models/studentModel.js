import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  studentNo: { type: String, unique: true, required: true }, 
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, 
  role: { type: String, default: 'student' },
  department: { type: String, required: true },
  qrCode: { type: String },
  resetPasswordToken: String,
	resetPasswordExpiresAt: Date,
	verificationToken: String,
	verificationTokenExpiresAt: Date,
});

const StudentModel = mongoose.model('Student', StudentSchema);
export default StudentModel;
