import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudentSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  studentNo: { type: String, unique: true, required: true }, // Öğrenci no zorunlu yapılmalı
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Şifre zorunlu olmalı
  role: { type: String, default: 'student' },
  department: { type: String, required: true },
  qrCode: { type: String },
});

const StudentModel = mongoose.model('Student', StudentSchema);

export default StudentModel;
