import express from "express";
import { PORT, mongoDBURL, jwtSecret } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import StudentModel from './models/studentModel.js';
import AcademianModel from './models/academianModel.js';
import AppointmentModel from './models/appointmentModel.js';
import cookieParser from "cookie-parser"; 
import CalendarModel from "./models/calendarModel.js";

const app = express();
const bcryptSalt = bcrypt.genSaltSync(8);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));

app.get('/', (req, res) => {
  res.send('Hello from API!');
});

app.post('/register', async (req, res) => {
  const { name, surname, email, password, role, department, studentNo } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    let userDoc;

    if (role === 'student') {
      userDoc = await StudentModel.create({
        name,
        surname,
        email,
        password: hashedPassword,
        department,
        role,
        studentNo
      });
    } else if (role === 'academician') {
      userDoc = await AcademianModel.create({
        name,
        surname,
        email,
        password: hashedPassword,
        role,
        department,
      });

      const defaultAvailability = [
        { day: 'Monday', slots: [{ date: '', isAvailable: true }] },
        { day: 'Tuesday', slots: [{ date: '', isAvailable: true }] },
        { day: 'Wednesday', slots: [{ date: '', isAvailable: true }] },
        { day: 'Thursday', slots: [{ date: '', isAvailable: true }] },
        { day: 'Friday', slots: [{ date: '', isAvailable: true }] },
        { day: 'Saturday', slots: [{ date: '', isAvailable: true }] },
        { day: 'Sunday', slots: [{ date: '', isAvailable: true }] }
      ];

      await CalendarModel.create({
        academian: userDoc._id,
        availability: defaultAvailability,
      });
    } else {
      return res.status(400).json('Invalid role');
    }

    const token = jwt.sign({ id: userDoc._id, email: userDoc.email }, jwtSecret);
    const qrCodeUrl = await QRCode.toDataURL(token);

    userDoc.qrCode = qrCodeUrl;
    await userDoc.save();

    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(422).json(e.message || 'An error occurred');
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    let userDoc = await StudentModel.findOne({ email });
    if (!userDoc) {
      userDoc = await AcademianModel.findOne({ email });
    }

    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              console.error(err);
              return res.status(500).json('Internal server error');
            } 
            // JWT response 
            res.cookie('token', token, { httpOnly: true }).json(userDoc);
          }
        );
      } else {
        res.status(422).json('Password is incorrect');
      }
    } else {
      res.status(404).json('User not found');
    }
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
});
app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      let userDoc = await StudentModel.findById(userData.id);
      if (!userDoc) {
        userDoc = await AcademianModel.findById(userData.id);
      }
      const { name, surname, email, _id, role, department, studentNo } = userDoc;
      res.json({ name, surname, email, _id, role, department, studentNo });
    });
  } else {
    res.json(null);
  }
});
app.post('/logout', (req, res) => { 
  res.cookie('token', '').json(true); 
});
app.get('/academicians', async (req, res) => {
  const academicians = await AcademianModel.find();
  res.json(academicians);
});
app.post('/availability', async (req, res) => {
  const { day, slots, academian } = req.body;

  try {
    const calendar = await CalendarModel.findOne({ academian: academian }); 
    if (!calendar) {
      return res.status(404).json('Calendar not found.');
    }
    const dayIndex = calendar.availability.findIndex((item) => item.day === day);
    if (dayIndex > -1) {
      calendar.availability[dayIndex].slots = slots;
    } else {
      calendar.availability.push({ day, slots });
    }
    await calendar.save();
    res.status(200).json(calendar);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occured.' });
  }
});
app.get('/availability', async (req, res) => {
  const { userId } = req.query; 
  try {
    if (!userId) {
      return res.status(400).json('User ID is required.');
    }
    const calendar = await CalendarModel.findOne({ academian: userId });
    if (!calendar) {
      return res.status(404).json('Calendar not found.');
    }
    res.status(200).json(calendar.availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});
app.delete('/availability/:userId', async (req, res) => {
  const { userId } = req.params;
  const { day, slot } = req.body;

  try {
    const calendar = await CalendarModel.findOne({ academian: userId });
    if (calendar) {
      const dayAvailability = calendar.availability.find(item => item.day === day);
      if (dayAvailability) {
        dayAvailability.slots = dayAvailability.slots.filter(s => s.date !== slot);
        await calendar.save();
        res.status(200).json({ message: 'The slot succesfully deleted' });
      } else {
        res.status(404).json({ message: 'Day not found' });
      }
    } else {
      res.status(404).json({ message: 'Calendar not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occured', error });
  }
});

app.get('/my-appointments', async (req, res) => {
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
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'An error occurred while fetching appointments.' });
    }
  });
});

app.post('/appointments', async (req, res) => {
  const { token } = req.cookies;
  const { academianId, day, slot, description } = req.body;
  
  if (!token) {
    return res.status(401).json('Unauthorized');
  }

  try {
    const userData = jwt.verify(token, jwtSecret);

    const student = await StudentModel.findById(userData.id);
    if (!student) {
      return res.status(404).json('Student not found.');
    }

    const newAppointment = await AppointmentModel.create({
      studentId: student.id,
      academianId: academianId,
      start,
      end,
      description,
      status: 'pending',
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'An error occurred while creating the appointment.' });
  }
});
//TO DO update must be update
app.patch('/appointments/:id', async (req, res) => {
  const { token } = req.cookies;
  const { status } = req.body;
  const { id } = req.params;

  if (!token) {
    return res.status(401).json('Unauthorized');
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      return res.status(403).json('Invalid token');
    }

    try {
      const userDoc = await AcademianModel.findById(userData.id);
      if (!userDoc) {
        return res.status(404).json('User not found.');
      }
      const appointment = await AppointmentModel.findById(id);
      if (!appointment) {
        return res.status(404).json('Appointment not found.');
      }
      if (appointment.academianId.toString() !== userData.id) {
        return res.status(403).json('You do not have permission to update this appointment.');
      }
      appointment.status = status;
      await appointment.save();

      if (status === 'accepted') {
        await CalendarModel.updateOne(
          { academian: userData.id, 'availability.day': appointment.date.day },
          { $pull: { 'availability.$.slots': { date: appointment.date.slot } } }
        );
      }

      res.json(appointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ error: 'An error occurred while updating the appointment.' });
    }
  });
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to the database.');
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });
