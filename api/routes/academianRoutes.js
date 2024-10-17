import express from "express";
import {
    postAcademianAvailability,
    getAcademianAvailability,
    getAcademians,
    deleteSlot,
    getCalendar
} from "../controllers/academianController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getAcademians);
router.get("/availability/:academianId", verifyToken, getAcademianAvailability);
router.post("/availability/:academianId", verifyToken, postAcademianAvailability);
router.delete("/availability/:academianId/:slotId", verifyToken, deleteSlot);
router.get("/calendar/:academianId", verifyToken, getCalendar);

export default router;