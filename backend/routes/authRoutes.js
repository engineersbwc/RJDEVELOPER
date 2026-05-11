const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login, verifyOTP, resendOTP, logout, getMe, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ── Auth helper: set HttpOnly cookie + redirect ────────────────────────────
const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;
  if (!frontendUrl) {
    console.warn('⚠️ FRONTEND_URL or CLIENT_URL not configured. OAuth redirects will fail.');
    return null;
  }
  return frontendUrl;
};

const oauthRedirect = (req, res) => {
  try {
    if (!req.user) {
      console.error("❌ OAuth redirect called without req.user");
      return res.status(500).json({ success: false, error: "OAuth callback did not return a valid user." });
    }

    const frontendUrl = getFrontendUrl();
    if (!frontendUrl) {
      console.error("❌ FRONTEND_URL or CLIENT_URL not configured for redirect");
      return res.status(500).json({ success: false, error: "Server misconfiguration: FRONTEND_URL not set." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not configured. Cannot sign token.");
      return res.status(500).json({ success: false, error: "Server misconfiguration: JWT_SECRET not set." });
    }

    console.log(`📡 Generating JWT for user: ${req.user.email}`);
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const isProd = process.env.NODE_ENV === "production";
    const { _id, name, email } = req.user;

    // Set HttpOnly cookie as fallback
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const redirectUrl = `${frontendUrl.replace(/\/+$/, '')}/oauth-success?token=${token}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&id=${_id}`;
    console.log(`🚀 Redirecting user to frontend: ${redirectUrl.split('?')[0]}...`);
    
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("❌ oauthRedirect Critical Error:", err.message);
    return res.status(500).json({ success: false, error: "Internal server error during OAuth redirection." });
  }
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
    return res.status(400).json({ success: false, error: "Google OAuth is not configured on this server." });
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("📨 Google Callback reached");
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(400).json({ success: false, error: "Google OAuth is not configured." });
    }

    const frontendUrl = getFrontendUrl();

    passport.authenticate("google", { 
      session: false, 
      failureRedirect: `${frontendUrl}/login?error=oauth_failed` 
    }, (err, user, info) => {
      if (err) {
        console.error("❌ Google callback Passport error:", err.message);
        return res.status(500).json({ success: false, error: `Authentication failed: ${err.message}` });
      }
      if (!user) {
        console.warn("⚠️ No user returned from Google Strategy");
        return res.redirect(`${frontendUrl}/login?error=no_user`);
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
    const frontendUrl = getFrontendUrl();
    passport.authenticate("facebook", { session: false, failureRedirect: `${frontendUrl}/login` })(req, res, next);
  },
  oauthRedirect
);

module.exports = router;
