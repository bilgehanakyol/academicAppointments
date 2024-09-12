import express from "express";
import { PORT, mongoDBURL, jwtSecret } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import StudentModel from './models/studentModel.js';
import AcademianModel from './models/academianModel.js';
//import CalendarModel from "./models/calendarModel.js";
import AppointmentModel from './models/appointmentModel.js';
import cookieParser from "cookie-parser"; 
import CalendarModel from "./models/calendarModel.js";

const app = express();
const bcryptSalt = bcrypt.genSaltSync(8);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // İzin verilen tüm adresleri ekleyin
  credentials: true // Çerezler ve diğer yetkilendirme bilgilerini gönder
}));

app.get('/', (req, res) => {
  res.send('Hello from API!');
});

 app.post('/register', async (req, res) => {
  const { name, surname, email, password, role, department, studentNo, availability } = req.body;
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

      if (availability) {
        await CalendarModel.create({
          academian: userDoc._id,
          availability, // Gelen takvim verisini kullan
        });
      } else {
        const defaultAvailability = [
          { day: 'Monday', slots: [{date: '15.00', isAvalible: true}] },
          { day: 'Tuesday', slots: [{}] },
          { day: 'Wednesday', slots: [{}] },
          { day: 'Thursday', slots: [{}] },
          { day: 'Friday', slots: [{}] },
          { day: 'Saturday', slots: [{}] },
          { day: 'Sunday', slots: [{}] }
        ];

        await CalendarModel.create({
          academian: userDoc._id,
          availability: defaultAvailability,
        });
      }
    } else {
      return res.status(400).json('Invalid role');
    }

    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(422).json(e);
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
        jwt.sign({
          email: userDoc.email,
          id: userDoc._id,
        }, jwtSecret, {}, (err, token) => {
          if (err) {
            console.error(err);
            res.status(500).json('Internal server error');
            return;
          }
          res.cookie('token', token, { httpOnly: true }).json(userDoc);
        });
      } else {
        res.status(422).json('Password is not correct');
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
      
      const { name, email, _id } = userDoc;
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => { 
  res.cookie('token', '').json(true); 
});

app.get('/academicians', async (req, res) => {
  const academicians = await AcademianModel.find(); // Academian modelinden tüm akademisyenleri al
  res.json(academicians); // JSON olarak döndür
});
// POST: /appointments
// app.post('/appointments', async (req, res) => {
//   const { academianId, studentId, date } = req.body;
//   try {
//       const appointment = new AppointmentModel({ academian: academianId, student: studentId, date });
//       await appointment.save();
//       res.json(appointment);
//   } catch (e) {
//       res.status(500).json({ error: 'Unable to create appointment' });
//   }
// });
// Öğrenci randevu talep eder
// app.post('/appointments', async (req, res) => {
//   const { studentId, academianId, date, description } = req.body;
//   try {
//     const appointment = await AppointmentModel.create({
//       studentId,
//       academianId,
//       date,
//       description
//     });
//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ error: 'Unable to create appointment' });
//   }
// });
// app.post('/appointments', async (req, res) => {
//   const { studentId, academianId, date, description } = req.body;
//   try {
//     const appointment = await AppointmentModel.create({
//       student: studentId,
//       academian: academianId,
//       date,
//       description
//     });
//     res.json(appointment);
//   } catch (error) {
//     res.status(500).json({ error: 'Unable to create appointment' });
//   }
// });
// Express API endpoint
// app.get('/academicians/:academianId/calendar', async (req, res) => {
//   const { academianId } = req.params;
//   try {
//     const calendar = await CalendarModel.findOne({ academian: academianId });
//     if (!calendar) {
//       return res.status(404).json('Takvim bulunamadı.');
//     }
//     res.json(calendar);
//   } catch (error) {
//     res.status(500).json({ error: 'Bir hata oluştu.' });
//   }
// });

// Müsaitlikleri eklemek için POST endpoint'i
// Müsaitlikleri eklemek için POST endpoint'i
app.post('/availability', async (req, res) => {
  const { day, slots, academian } = req.body;
   // JWT'den userId'yi al

  try {
    // Kullanıcının takvimini bul
    const calendar = await CalendarModel.findOne({ academian: academian }); 

    if (!calendar) {
      return res.status(404).json('Takvim bulunamadı.');
    }

    const dayIndex = calendar.availability.findIndex((item) => item.day === day);

    if (dayIndex > -1) {
      // Gün mevcutsa, dilimleri güncelle
      calendar.availability[dayIndex].slots = slots;
    } else {
      // Gün mevcut değilse, yeni gün ekle
      calendar.availability.push({ day, slots });
    }

    await calendar.save();
    res.status(200).json(calendar);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Bir hata oluştu.' });
  }
});

// Müsaitlikleri almak için GET endpoint'i
app.get('/availability', async (req, res) => {
  const { userId } = req.query; // ID'yi query parametreleri olarak al

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
