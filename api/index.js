import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import cron from "node-cron"

import { connectDB } from "./db/connectdb.js";

import authRouter from "./routes/authRoutes.js";
import academianRouter from "./routes/academianRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import templateRouter from "./routes/templateRoutes.js";
import CalendarModel from "./models/CalendarModel.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));
dotenv.config();

cron.schedule('0 0 * * 0', async () => {
  try {
      const calendars = await CalendarModel.find();

      calendars.forEach(async (calendar) => {
          calendar.availability.forEach(day => {
              day.slots.forEach(slot => {
                  slot.isAvailable = true;
              });
          });
          await calendar.save();
      });

      console.log("All slots have been set to available on Sunday at 00:00.");
  } catch (error) {
      console.error("Error updating slots:", error);
  }
});

app.use('/auth', authRouter);
app.use('/academians', academianRouter);
app.use('/appointments', appointmentRouter);
app.use('/students', studentRouter);
app.use('/templates', templateRouter);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log('Server is running PORT 5555');
});