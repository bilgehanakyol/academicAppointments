import express from "express";
import {
    postAcademianAvailability,
    getAcademianAvailability,
    getAcademians,
    deleteSlot,
    getCalendar
} from "../controllers/academianController.js";

const router = express.Router();

router.get("/", getAcademians);
router.get("/availability/:academianId", getAcademianAvailability);
router.post("/availability/:academianId", postAcademianAvailability);
router.delete("/availability/:academianId/:slotId", deleteSlot);
router.get("/calendar/:academianId", getCalendar);

export default router;