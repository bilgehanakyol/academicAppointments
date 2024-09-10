import mongoose from 'mongoose';
const { Schema } = mongoose;

const AcademianSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: {type: String, unique: true},
    password: {type: String, unique: true},
    role: { type: String, default: 'academian' },
    department: { type: String, required: true }
});

const AcademianModel = mongoose.model('Academian', AcademianSchema);

export default AcademianModel;
