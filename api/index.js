import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { PORT, jwtSecret } from "./config.js";
import StudentModel from './models/studentModel.js';
//import AcademianModel from './models/academianModel.js';
import AppointmentModel from './models/appointmentModel.js';
import AppointmentRequestTemplateModel from "./models/AppointmentRequestTemplate.js";
import cookieParser from "cookie-parser"; 
//import CalendarModel from "./models/calendarModel.js";
import { connectDB } from "./db/connectdb.js";
import { sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail, } from "./mailtrap/emails.js";

 import authRouter from "./routes/authRoutes.js";
 import academianRouter from "./routes/academianRoutes.js";
 //import calendarRouter from "./routes/calendarRoutes.js";
 //import appointmentRouter from "./routes/appointmentRoutes.js";
// import requestTemplateRouter from "./routes/requestTemplateRoutes.js";
// import { verifyToken } from "./middleware/verifyToken.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));
dotenv.config();

app.use('/auth', authRouter);
app.use('/academians', academianRouter);


// app.get('/academicians', async (req, res) => {
//   const academicians = await AcademianModel.find();
//   res.json(academicians);
// });
// app.post('/availability/:academianId', async (req, res) => {
//   const { academianId } = req.params;
//   const { availability } = req.body; 
//   try {
//     // Akademisyenin takvimini bul
//     let calendar = await CalendarModel.findOne({ academian: academianId });

//     // Eğer takvim yoksa yeni bir takvim oluştur
//     if (!calendar) {
//       calendar = new CalendarModel({ academian: academianId, availability: [] });
//     }

//     // Müsaitlikleri güncelle
//     const dayIndex = calendar.availability.findIndex(d => d.day === availability.day);
//     if (dayIndex > -1) {
//       calendar.availability[dayIndex].slots.push(...availability.slots);
//     } else {
//       calendar.availability.push(availability);
//     }

//     await calendar.save();
//     res.status(200).json({ message: 'Availability updated successfully', calendar });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.get('/availability/:academianId', async (req, res) => {
//   const { academianId } = req.params;

//   try {
//     const calendar = await CalendarModel.findOne({ academian: academianId });
//     if (!calendar) {
//       return res.status(404).json({ message: 'Calendar not found' });
//     }

//     res.status(200).json(calendar.availability);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// app.delete('/availability/:academianId/:slotId', async (req, res) => {
//   const { academianId, slotId } = req.params;

//   try {
//     const calendar = await CalendarModel.findOne({ academian: academianId });
//     if (!calendar) {
//       return res.status(404).json({ message: 'Calendar not found' });
//     }

//     let found = false;

//     calendar.availability.forEach(day => {
//       day.slots = day.slots.filter(slot => {
//         const isSlotDeleted = slot._id.toString() === slotId;
//         if (isSlotDeleted) found = true;
//         return !isSlotDeleted;
//       });
//     });

//     if (!found) {
//       return res.status(404).json({ message: 'Slot not found' });
//     }

//     await calendar.save();
//     res.status(200).json({ message: 'Slot deleted successfully', calendar });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
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

    const { academianId, calendarSlotId, date, startTime, endTime, description, notes } = req.body;
    //console.log('Veriler:', req.body);
    // Randevu başlangıç ve bitiş zamanlarını oluştur
    const startDateTime = new Date(`${date}T${startTime}:00Z`);
    const endDateTime = new Date(`${date}T${endTime}:00Z`);

    // Aynı zaman diliminde başka bir kabul edilmiş randevu var mı kontrol et
    const existingAppointment = await AppointmentModel.findOne({
      academianId,
      startTime: { $lt: endDateTime }, // Randevu bitişi mevcutdan küçük
      endTime: { $gt: startDateTime }, // Randevu başlangıcı mevcutdan büyük
    });

    if (existingAppointment) {
      console.log('Çakışan randevu bulundu:', existingAppointment);
      return res.status(400).json({ message: 'Bu zaman dilimi başka bir randevu ile çakışıyor.' });
    }
    // Randevu nesnesi oluştur
    const newAppointment = new AppointmentModel({
      studentId, 
      academianId,
      calendarSlotId,
      date,
      startTime,
      endTime,
      description,
      notes
    });
    // Randevuyu kaydet
    await newAppointment.save();
    res.status(201).json({ message: 'Randevu başarıyla oluşturuldu', appointment: newAppointment });
  } catch (error) {
    console.error('Randevu oluşturulurken hata:', error);
    res.status(500).json({ message: 'Randevu oluşturulurken hata oluştu' });
  }
});

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

// Sadece randevunun notlarını güncellemek için yeni bir endpoint
app.patch('/appointments/:id/notes', async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body; // Notes bilgisini al

  try {
    // Randevuyu bul
    const appointment = await AppointmentModel.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Sadece notes alanını güncelle
    appointment.notes = notes;

    // Güncellemeyi kaydet
    await appointment.save();

    return res.status(200).json({ message: 'Notes updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating notes', error });
  }
});
// Sadece randevunun status'unu güncellemek için mevcut endpoint'i kullan
app.patch('/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Status bilgisini al

  try {
    const appointment = await AppointmentModel.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Eğer randevunun isAvailable değeri false ise hata döndür
    //TODO:     if (!appointment.isAvailable && status === 'confirmed') şeklindeydi takvimdeki isAvalibleye göre tekrar yaz
    if (status === 'confirmed') {
      return res.status(400).json({ message: 'This appointment is no longer available' });
    }

    // Status alanını güncelle
    appointment.status = status;

    // Eğer status confirmed ise isAvailable alanını false yap
    if (status === 'confirmed') {
      //appointment.isAvailable = false; TODO: takvimdekine göre falsela
      const calendar = await CalendarModel.findOne({ academian: appointment.academianId });

      if (!calendar) {
        return res.status(404).json({ message: 'Calendar not found' });
      }

      const updatedSlots = calendar.availability.map((day) => {
        return day.slots.map((slot) => {
          if (slot.start === appointment.startTime && slot.end === appointment.endTime) {
            slot.isAvailable = false;
          }
          return slot;
        });
      });

      calendar.availability.forEach(day => day.slots = updatedSlots);
      await calendar.save();
    }

    await appointment.save();
    return res.status(200).json({ message: 'Appointment status updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating appointment status', error });
  }
});


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
app.get('/appointments/students/:studentId/academians/:academianId', async (req, res) => {
  const { studentId, academianId } = req.params;

  try {
    // Veritabanında öğrenci ve akademisyen id'leri ile eşleşen tüm randevuları buluyoruz
    const appointments = await AppointmentModel.find({
      studentId: studentId,
      academianId: academianId,
      status: 'confirmed' 
    });

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this student and academician.' });
    }

    return res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// get the academian calendar
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
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error searching for student:', error);
    res.status(500).json({ message: 'Öğrenci aranırken hata oluştu' });
  }
});
//TO DO: it must be tested
app.get('/appointment-templates', async (req, res) => {
  try {
    const templates = await AppointmentRequestTemplateModel.find();
    res.status(200).json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch templates", error });
  }
});
app.post('/add-appointment-template', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Title and content are required." });
  }

  try {
    const newTemplate = new AppointmentRequestTemplateModel({ title, content });
    await newTemplate.save();
    res.status(200).json({ success: true, message: "Template added successfully." });
  } catch (error) {
    console.error("Error adding template:", error); // Hata mesajını logla
    res.status(500).json({ success: false, message: "Server error, could not add template." });
  }
});

app.listen(PORT, () => {
  connectDB();
  console.log('Server is running PORT 5555');
});