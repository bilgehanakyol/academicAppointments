import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import UserModel from "./models/userModel.js";
import jwt from 'jsonwebtoken';

const app = express();
const bcryptSalt = bcrypt.genSaltSync(8);

const jwtSecret = 'domystringasd';

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // İzin verilen tüm adresleri ekleyin
  credentials: true // Çerezler ve diğer yetkilendirme bilgilerini gönder
}));

app.get('/', (req, res) => {
  res.send('Hello from API!');
});

// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
//     const userDoc = await UserModel.create({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     res.json(userDoc);
//   } catch (e) {
//     console.error(e);
//     res.status(422).json(e);
//   }
// });

app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role, // Role (student veya academician) ekliyoruz
    });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(422).json(e);
  }
});
app.post('/set-availability', async (req, res) => {
  const { token } = req.cookies;
  const { date, timeSlots } = req.body;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      const userDoc = await UserModel.findById(userData.id);
      if (userDoc.role === 'academician') { // Yalnızca akademisyenler randevu ekleyebilir
        userDoc.availability.push({ date, timeSlots });
        await userDoc.save();
        res.json(userDoc);
      } else {
        res.status(403).json('Only academicians can set availability');
      }
    });
  } else {
    res.status(401).json('Unauthorized');
  }
});
app.get('/availability/:academicianId', async (req, res) => {
  const { academicianId } = req.params;

  try {
    const academician = await UserModel.findById(academicianId);
    if (academician && academician.role === 'academician') {
      res.json(academician.availability);
    } else {
      res.status(404).json('Academician not found or invalid role');
    }
  } catch (e) {
    console.error(e);
    res.status(500).json('Error fetching availability');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await UserModel.findOne({ email });
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
  const {token} = req.cookies;
  if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) throw err;
          const {name, email, _id} = await UserModel.findById(userData.id);
          res.json({name, email, _id});
      });
  } else {
      res.json(null);
  }
});
app.post('/logout', (req, res) => { 
  res.cookie('token', '').json(true); 
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
