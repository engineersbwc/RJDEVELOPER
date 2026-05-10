const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login, verifyOTP, resendOTP, logout, getMe, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Auth helper: set HttpOnly cookie + redirect ────────────────────────────
const oauthRedirect = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const isProd = process.env.NODE_ENV === "production";

  // Set HttpOnly cookie on the BACKEND domain
  // This cookie travels cross-domain because SameSite=None + Secure (HTTPS)
  // On localhost (HTTP), we fall back to SameSite=Lax without Secure
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const name  = encodeURIComponent(req.user.name  || "");
  const email = encodeURIComponent(req.user.email || "");
  const id    = req.user._id.toString();

  // Pass name/email/id in URL so frontend can show welcome message instantly
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?name=${name}&email=${email}&id=${id}`);
};

// ── Standard Auth Routes ───────────────────────────────────────────────────
router.post("/register",        register);
router.post("/login",           login);
router.post("/verify-otp",      verifyOTP);
router.post("/resend-otp",      resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPassword);
router.get("/logout",           logout);
router.get("/me",  protect,     getMe);

// ── Google OAuth ───────────────────────────────────────────────────────────
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  oauthRedirect
);

// ── Facebook OAuth ─────────────────────────────────────────────────────────
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  oauthRedirect
);

module.exports = router;
