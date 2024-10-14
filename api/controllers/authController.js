import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import StudentModel from '../models/studentModel.js';
import AcademianModel from '../models/AcademianModel.js';
import CalendarModel from '../models/CalendarModel.js';
import {
    sendVerificationEmail, 
    sendPasswordResetEmail,
    sendResetSuccessEmail 
} from '../mailtrap/emails.js';
const jwtSecret = process.env.JWT_SECRET;

// Kayıt işlemi
export const register = async (req, res) => {
  const { name, surname, email, password, role, department, studentNo } = req.body;

  try {
    const studentExists = await StudentModel.findOne({ email });
    const academianExists = await AcademianModel.findOne({ email });

    if (studentExists || academianExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    let userDoc;

    if (role === 'student') {
      userDoc = await StudentModel.create({
        name,
        surname,
        email,
        password,
        department,
        role,
        studentNo,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        isVerified: false 
      });
    } else if (role === 'academician') {
      userDoc = await AcademianModel.create({
        name,
        surname,
        email,
        password,
        department,
        role,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        isVerified: false 
      });

      await CalendarModel.create({
        academian: userDoc._id,
        availability: [],
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    // sadece mailtrap mailine gönderebildiğin için kapadım TODO
    //await sendVerificationEmail(userDoc.email, verificationToken);
    res.json({ success: true, message: 'Registration successful. Please verify your email.' });
  } catch (e) {
    console.error(e);
    res.status(422).json({ success: false, message: e.message || 'An error occurred' });
  }
};

// E-posta doğrulama
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const userDoc = await StudentModel.findOne({ verificationToken: token }) || 
                    await AcademianModel.findOne({ verificationToken: token });

    if (!userDoc) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    if (userDoc.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'Verification token expired' });
    }

    userDoc.isVerified = true;
    userDoc.password = await bycrypt.hash(userDoc.password, 10);
    userDoc.verificationToken = undefined;
    userDoc.verificationTokenExpiresAt = undefined;
    await userDoc.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

// Giriş yapma
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userDoc = await StudentModel.findOne({ email }) || await AcademianModel.findOne({ email });

    if (!userDoc) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    const passOk = bycrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) {
          console.error(err);
          return res.status(500).json('Internal server error');
        }
        res.cookie('token', token, { httpOnly: true }).json(userDoc);
      });
    } else {
      res.status(422).json('Password is incorrect');
    }
  } catch (e) {
    console.error(e);
    res.status(500).json('Internal server error');
  }
};

//profile TODO: take only necessary data
export const profile = (req, res) => {
  const { token } = req.cookies;
  if(token) {
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
}
// Çıkış yapma
export const logout = (req, res) => {
  res.cookie('token', '', { maxAge: 1 }).json({ success: true });
};

// Şifre sıfırlama isteği
export const requestReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await StudentModel.findOne({ email }) || 
    await AcademianModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Email not found." });
    }

    const resetToken = crypto.randomBytes(15).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ success: true, message: "Reset link sent to your email!" });
  } catch (err) {
    console.error("Error in /request-reset:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Şifre sıfırlama işlemi
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await StudentModel.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } }) ||
                 await AcademianModel.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    user.password = await bycrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password", error);
    res.status(400).json({ success: false, message: error.message });
  }
};