import mongoose from 'mongoose';
const { Schema } = mongoose;

const AppointmentSchema = new Schema({
    talepEden: {
        name: { type: String, required: true },
        surname: { type: String, required: true }
    },
    talepEdilen: {
        name: { type: String, required: true },
        surname: { type: String, required: true }
    },
    status: { 
        type: String, 
        enum: ['waiting', 'decline', 'accept'], 
        default: 'waiting' 
    },
    date: { type: Date, required: true }
});

const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);

export default AppointmentModel;
