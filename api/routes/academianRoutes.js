import express from "express";
import {
    postAcademianAvailability,
    getAcademianAvailability,
    getAcademians,
    deleteSlot,
    getCalendar
} from "../controllers/academianController.js";

const router = express.Router();

router.get("/academians", getAcademians);
router.get("/academians/availability", getAcademianAvailability);
router.post("/academians/availability", postAcademianAvailability);
router.delete("/academians/availability/:academianId/:slotId", deleteSlot);
router.get("/calendar/:academianId", getCalendar);

export default router;