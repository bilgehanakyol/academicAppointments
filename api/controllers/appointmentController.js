import AppointmentModel from "../models/appointmentModel.js";
import StudentModel from "../models/studentModel.js";
import AcademianModel from "../models/AcademianModel.js";
import CalendarModel from "../models/CalendarModel.js";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;

export const getAppointment = async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json('Unauthorized');
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            return res.status(403).json('Invalid token');
        }

        try {
            let appointments;
            let userDoc;
            userDoc = await StudentModel.findById(userData.id);
            if (!userDoc) {
                userDoc = await AcademianModel.findById(userData.id);
                if (!userDoc) {
                    return res.status(404).json('User not found.');
                }
            }
            if (userDoc.role === 'student') {
                appointments = await AppointmentModel.find({ studentId: userData.id })
                    .populate('academianId');
            }
            else if (userDoc.role === 'academician') {
                appointments = await AppointmentModel.find({ academianId: userData.id })
                    .populate('studentId');
            }
            if (!appointments.length) {
                return res.status(404).json('No appointments found');
            }
            res.json(appointments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching appointments' });
        }
    });
};

export const createAppointment = async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json('Unauthorized');
    }
    let userData;
    try {
        userData = jwt.verify(token, jwtSecret);
    } catch (error) {
        return res.status(401).json('Invalid token');
    }
    const { id: studentId } = userData;
    const { academianId, calendarSlotId, date, startTime, endTime, description, notes } = req.body;

    const startDateTime = new Date(`${date}T${startTime}:00Z`);
    const endDateTime = new Date(`${date}T${endTime}:00Z`);

    try {
        const existingAppointment = await AppointmentModel.findOne({
            academianId,
            startTime: { $lt: endDateTime }, // Randevu bitişi mevcutdan küçük
            endTime: { $gt: startDateTime }, // Randevu başlangıcı mevcutdan büyük
        });
        if (existingAppointment) {
            console.log('Appointment already exists:', existingAppointment);
            return res.status(400).json({ message: 'This time slot is already booked.' });
        }

        const newAppointment = new AppointmentModel({
            studentId,
            academianId,
            calendarSlotId,
            date,
            startTime,
            endTime,
            description,
            notes,
        });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating appointment.' });
    }
};
export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    try {
        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Status kontrolü ekleniyor
        if (appointment.status !== 'confirmed') {
            return res.status(403).json({ message: 'Only confirmed appointments can be updated' });
        }

        if (!startTime || !endTime) {
            return res.status(400).json({ message: 'Start time and end time are required' });
        }

        appointment.startTime = startTime;
        appointment.endTime = endTime;
        await appointment.save();

        res.status(200).json({ message: 'Appointment updated successfully', appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating appointment' });
    }
};



export const updateAppointmentNotes = async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;
    try {
        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        appointment.notes = notes;
        await appointment.save();
        res.status(200).json({ message: 'Notes updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating notes' });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const appointment = await AppointmentModel.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const calendar = await CalendarModel.findOne({ academian: appointment.academianId });

        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }

        const slot = calendar.availability.flatMap(
            day => day.slots).find(slot => 
                slot._id.toString() === appointment.calendarSlotId.toString()
                );
            
        if (!slot) {
            appointment.status = 'cancelled';
            await appointment.save();
            return res.status(404).json({ message: 'Slot not found in the calendar' });
        } 
        appointment.status = status;
        if (appointment.status === 'cancelled') {
            appointment.status = 'cancelled';
            await appointment.save();
            return res.status(200).json({ message: 'Appointment status updated successfully' });
        } 
        else {
            if (appointment.status === 'confirmed' && slot.isAvailable === true) {
                appointment.status = 'confirmed';
                slot.isAvailable = false;
                await appointment.save();
                await calendar.save();
                return res.status(200).json({ message: 'Appointment status updated successfully' });
            } 
            else {
                console.log(appointment.status, slot.isAvailable);
                appointment.status = 'cancelled';
                await appointment.save();
                return res.status(200).json({ message: 'This slot is not available' });
            }
        }
        return res.status(200).json({ message: 'Appointment status updated successfully' });
    } catch (error) {
        console.error('Error updating appointment status:', error);
        return res.status(500).json({ message: 'Error updating appointment status', error });
    }
}

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await AppointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        await appointment.remove();
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting appointment' });
    }
};

export const getStudentandAcademian = async (req, res) => {
    const { studentId, academianId } = req.params;
    try {
        const appointments = await AppointmentModel.find({
            studentId,
            academianId,
            status: 'confirmed'
        });
        if (!appointments) {
            return res.status(404).json({ message: 'Appointments not found' });
        }
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting appointments' });
    }
}