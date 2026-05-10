const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login, verifyOTP, resendOTP, logout, getMe, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Auth helper: set HttpOnly cookie + redirect ────────────────────────────
const getFrontendUrl = () => process.env.CLIENT_URL || process.env.FRONTEND_URL || "https://rjdeveloper-tawny.vercel.app";

const oauthRedirect = (req, res) => {
  if (!req.user) {
    console.error("OAuth redirect called without req.user");
    return res.status(500).json({ success: false, error: "OAuth callback did not return a valid user." });
  }

  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const isProd = process.env.NODE_ENV === "production";
  const { _id, name, email } = req.user;
  const frontendUrl = getFrontendUrl();

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.redirect(`${frontendUrl}/oauth-success?token=${token}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&id=${_id}`);
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
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({ success: false, error: "Google OAuth is not configured on this server. Please check environment variables." });
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(400).json({ success: false, error: "Google OAuth is not configured." });
    }

    const frontendUrl = getFrontendUrl();

    passport.authenticate("google", { session: false, failureRedirect: `${frontendUrl}/login` }, (err, user, info) => {
      if (err) {
        console.error("Google callback error:", err, info);
        return res.status(500).json({ success: false, error: "Google OAuth error. Check backend logs." });
      }
      if (!user) {
        return res.redirect(`${frontendUrl}/login`);
      }
      req.user = user;
      return oauthRedirect(req, res);
    })(req, res, next);
  }
);

// ── Facebook OAuth ─────────────────────────────────────────────────────────
router.get("/facebook", (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    return res.status(400).json({ success: false, error: "Facebook OAuth is not configured on this server." });
  }
  passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
});

router.get(
  "/facebook/callback",
  (req, res, next) => {
    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      return res.status(400).json({ success: false, error: "Facebook OAuth is not configured." });
    }
    passport.authenticate("facebook", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` })(req, res, next);
  },
  oauthRedirect
);

module.exports = router;
