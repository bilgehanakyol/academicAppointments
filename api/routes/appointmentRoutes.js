import express from "express";
import {
    getAppointment,
    createAppointment,
    deleteAppointment,
    updateAppointmentNotes,
    updateAppointmentStatus,
    getStudentandAcademian
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/:id", getAppointment);
router.post("/", createAppointment);
router.delete("/:id", deleteAppointment);
router.patch("/:id/notes", updateAppointmentNotes);
router.patch("/:id/status", updateAppointmentStatus);
router.get("/:studentId/:academianId", getStudentandAcademian);

export default router;