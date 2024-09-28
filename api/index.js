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
        { day: 'Monday', slots: [{ start: new Date('09:00'), end: new Date('17:00'), isAvailable: true }] },
        { day: 'Tuesday', slots: [{ start: new Date('09:00'), end: new Date('17:00'), isAvailable: true }] },
        { day: 'Wednesday', slots: [{ start: new Date('09:00'), end: new Date('17:00'), isAvailable: true }] },
        { day: 'Thursday', slots: [{ start: new Date('09:00'), end: new Date('17:00'), isAvailable: true }] },
        { day: 'Friday', slots: [{ start: new Date('09:00'), end: new Date('17:00'), isAvailable: true }] },
        { day: 'Saturday', slots: [] },
        { day: 'Sunday', slots: [] }
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
app.post('/availability/:academianId', async (req, res) => {
  const { academianId } = req.params;
  const { availability } = req.body; 
  try {
    // Akademisyenin takvimini bul
    let calendar = await CalendarModel.findOne({ academian: academianId });

    // Eğer takvim yoksa yeni bir takvim oluştur
    if (!calendar) {
      calendar = new CalendarModel({ academian: academianId, availability: [] });
    }

    // Müsaitlikleri güncelle
    const dayIndex = calendar.availability.findIndex(d => d.day === availability.day);
    if (dayIndex > -1) {
      calendar.availability[dayIndex].slots.push(...availability.slots);
    } else {
      calendar.availability.push(availability);
    }

    await calendar.save();
    res.status(200).json({ message: 'Availability updated successfully', calendar });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/availability/:academianId', async (req, res) => {
  const { academianId } = req.params;

  try {
    const calendar = await CalendarModel.findOne({ academian: academianId });
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    res.status(200).json(calendar.availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/availability/:academianId/:slotId', async (req, res) => {
  const { academianId, slotId } = req.params;

  try {
    const calendar = await CalendarModel.findOne({ academian: academianId });
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    let found = false;

    calendar.availability.forEach(day => {
      day.slots = day.slots.filter(slot => {
        const isSlotDeleted = slot._id.toString() === slotId;
        if (isSlotDeleted) found = true;
        return !isSlotDeleted;
      });
    });

    if (!found) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    await calendar.save();
    res.status(200).json({ message: 'Slot deleted successfully', calendar });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı' });
  }

  try {
    const userData = jwt.verify(token, jwtSecret); 
    const { id: studentId } = userData; 

    const { academianId, date, startTime, endTime, description } = req.body;

    // Randevu başlangıç ve bitiş zamanlarını oluştur
    const startDateTime = new Date(`${date}T${startTime}:00Z`);
    const endDateTime = new Date(`${date}T${endTime}:00Z`);

    // Aynı zaman diliminde başka bir kabul edilmiş randevu var mı kontrol et
    const existingAppointment = await AppointmentModel.findOne({
      academianId,
      startTime: { $lt: endDateTime }, // Randevu bitişi mevcutdan küçük
      endTime: { $gt: startDateTime }, // Randevu başlangıcı mevcutdan büyük
      isAvailable: false // Sadece kabul edilmiş randevuları kontrol et
    });

    if (existingAppointment) {
      console.log('Çakışan randevu bulundu:', existingAppointment);
      return res.status(400).json({ message: 'Bu zaman dilimi başka bir randevu ile çakışıyor.' });
    }

    // Randevu nesnesi oluştur
    const newAppointment = new AppointmentModel({
      studentId, 
      academianId,
      date,
      startTime,
      endTime,
      description,
      isAvailable: false // Varsayılan olarak isAvailable değerini false yap
    });

    // Randevuyu kaydet
    await newAppointment.save();
    res.status(201).json({ message: 'Randevu başarıyla oluşturuldu', appointment: newAppointment });
  } catch (error) {
    console.error('Randevu oluşturulurken hata:', error);
    res.status(500).json({ message: 'Randevu oluşturulurken hata oluştu' });
  }
});

// //TO DO update must be update
// app.patch('/appointments/:id', async (req, res) => {
//   const { token } = req.cookies;
//   const { status } = req.body;
//   const { id } = req.params;

//   if (!token) {
//     return res.status(401).json('Unauthorized');
//   }

//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) {
//       return res.status(403).json('Invalid token');
//     }

//     try {
//       const userDoc = await AcademianModel.findById(userData.id);
//       if (!userDoc) {
//         return res.status(404).json('User not found.');
//       }
//       const appointment = await AppointmentModel.findById(id);
//       if (!appointment) {
//         return res.status(404).json('Appointment not found.');
//       }
//       if (appointment.academianId.toString() !== userData.id) {
//         return res.status(403).json('You do not have permission to update this appointment.');
//       }
//       appointment.status = status;
//       await appointment.save();

//       if (status === 'accepted') {
//         await CalendarModel.updateOne(
//           { academian: userData.id, 'availability.day': appointment.date.day },
//           { $pull: { 'availability.$.slots': { date: appointment.date.slot } } }
//         );
//       }

//       res.json(appointment);
//     } catch (error) {
//       console.error('Error updating appointment:', error);
//       res.status(500).json({ error: 'An error occurred while updating the appointment.' });
//     }
//   });
// });

// Tüm randevuları listeleme (akademisyen bazında)
app.get('/appointments/:academianId', async (req, res) => {
  const { academianId } = req.params;

  try {
    const appointments = await AppointmentModel.find({ academian: academianId })
      .populate('student', 'name studentNo') // Öğrenci bilgilerini doldur
      .populate('academian', 'name'); // Akademisyen bilgilerini doldur

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Randevu durumu güncelleme
app.patch('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
});

// Randevu silme
app.delete('/appointments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAppointment = await AppointmentModel.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
});

// Akademisyenin takvimini görüntüleme
app.get('/calendar/:academianId', async (req, res) => {
  const { academianId } = req.params;

  try {
    const calendar = await CalendarModel.findOne({ academian: academianId }).populate('academian');
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    res.status(200).json(calendar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching calendar' });
  }
});

//Student
app.get('/students', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Öğrenciler getirilirken hata oluştu' });
  }
});
app.get('/students/search', async (req, res) => {
  const { studentNo } = req.query;

  try {
    const student = await StudentModel.findOne({ studentNo });

    if (!student) {
      return res.status(404).json({ message: 'Öğrenci bulunamadı' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error searching for student:', error);
    res.status(500).json({ message: 'Öğrenci aranırken hata oluştu' });
  }
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
