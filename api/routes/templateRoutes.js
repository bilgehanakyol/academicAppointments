import express from "express";
import {
    templates,
    addTemplate
} from "../controllers/templatesContoler.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, templates);
router.post("/", verifyToken, addTemplate);

export default router;