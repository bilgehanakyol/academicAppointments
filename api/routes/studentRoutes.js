import express from "express";
import {
    getStudent,
    searchStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getStudent);
router.get("/search", searchStudent);

export default router;
