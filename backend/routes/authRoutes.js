const express = require("express");
const { register, login, verifyOTP, resendOTP, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.get("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
