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
  origin: 'http://localhost:5173', // React uygulamanızın origin'i
  credentials: true // Çerezler ve diğer yetkilendirme bilgilerini gönder
}));

app.get('/', (req, res) => {
  res.send('Hello from API!');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(422).json(e);
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
