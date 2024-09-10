import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    studentNo: { type: String, required: true, unique: true },
    email: {type: String, unique: true},
    password: {type: String, unique: true},
    role: { type: String, default: 'student' },
    department: { type: String, required: true }
});

const StudentModel = mongoose.model('Student', StudentSchema);

export default StudentModel;
