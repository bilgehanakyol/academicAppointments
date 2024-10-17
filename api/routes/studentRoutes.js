import express from "express";
import {
    getStudent,
    searchStudent,
} from "../controllers/studentController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getStudent);
router.get("/search", verifyToken, searchStudent);

export default router;
