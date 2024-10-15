import express from "express";
import {
    templates,
    addTemplate
} from "../controllers/templatesContoler.js";

const router = express.Router();

router.get("/", templates);
router.post("/", addTemplate);

export default router;