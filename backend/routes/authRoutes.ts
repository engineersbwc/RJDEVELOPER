import express from "express";
import { register, login, verifyOTP, resendOTP, logout, getMe } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/logout", logout);
router.get("/me", protect, getMe);

export default router;
