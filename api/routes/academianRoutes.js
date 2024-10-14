import express from "express";
import {
    postAcademianAvailability,
    getAcademianAvailability,
    getAcademians,
    deleteSlot
} from "../controllers/academianController.js";

const router = express.Router();

router.get("/academians", getAcademians);
router.get("/academians/availability", getAcademianAvailability);
router.post("/academians/availability", postAcademianAvailability);
router.delete("/academians/availability/:academianId/:slotId", deleteSlot);

export default router;