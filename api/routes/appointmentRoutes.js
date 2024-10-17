import express from "express";
import {
    getAppointment,
    createAppointment,
    deleteAppointment,
    updateAppointmentNotes,
    updateAppointmentStatus,
    getStudentandAcademian,
    updateAppointment
} from "../controllers/appointmentController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getAppointment);
router.patch("/:id", verifyToken, updateAppointment)
router.post("/", verifyToken, createAppointment);
router.delete("/:id", verifyToken, deleteAppointment);
router.patch("/:id/notes", verifyToken, updateAppointmentNotes);
router.patch("/:id/status", verifyToken, updateAppointmentStatus);
router.get("/:studentId/:academianId", verifyToken, getStudentandAcademian);

export default router;