import express from "express";
import {
    register,
    verifyEmail,
    login,
    logout,
    requestReset,
    resetPassword,
    profile
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/profile", profile);
router.get("/logout", logout);
router.post("/request-reset", requestReset);
router.post("/reset-password/:token", resetPassword);

export default router;