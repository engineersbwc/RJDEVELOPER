const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.cjs");
const sendEmail = require("../utils/sendEmail.cjs");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id.toString());
  const cookieExpire = 7 * 24 * 60 * 60 * 1000;

  const isProd = process.env.NODE_ENV === "production";
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpire),
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
    })
    .json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const otpEmailHtml = (otp, heading = "Verify your email") => `
<div style="font-family:Arial,sans-serif;background:#0f172a;color:#fff;padding:40px;border-radius:12px;max-width:480px;margin:auto">
  <h2 style="color:#f59e0b;margin-bottom:8px">${heading}</h2>
  <p style="color:#94a3b8;margin-bottom:24px">Use the code below. It expires in <strong>30 seconds</strong>.</p>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px">
    <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#f59e0b">${otp}</span>
  </div>
  <p style="color:#64748b;font-size:12px">If you didn't request this, please ignore this email.</p>
</div>`;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, error: "Please provide name, email and password." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      if (existing.isVerified) {
        return res.status(400).json({ success: false, error: "An account with this email already exists." });
      }
      await User.deleteOne({ _id: existing._id });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 30000);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    });

    try {
      await sendEmail({
        email: user.email,
        subject: "Your RJ Developer Verification Code",
        message: otpEmailHtml(otp),
      });
    } catch (emailErr) {
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ success: false, error: "Could not send verification email. Please try again." });
    }

    res.status(200).json({
      success: true,
      message: "A 6-digit OTP has been sent to your email.",
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: "Email and OTP are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ success: false, error: "Account not found." });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, error: "Account is already verified." });
    }
    if (!user.otp || user.otp !== otp.toString()) {
      return res.status(400).json({ success: false, error: "Invalid OTP. Please try again." });
    }
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, error: "OTP has expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ success: false, error: "Account not found." });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, error: "Account is already verified." });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 30000);
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Your New RJ Developer Verification Code",
        message: otpEmailHtml(otp, "New verification code"),
      });
    } catch (emailErr) {
      return res.status(500).json({ success: false, error: "Could not send email. Please try again." });
    }

    res.status(200).json({ success: true, message: "A new OTP has been sent to your email." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, error: "Please provide email and password." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    if (!user.isVerified) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 30000);
      await user.save();

      try {
        await sendEmail({
          email: user.email,
          subject: "Complete your RJ Developer verification",
          message: otpEmailHtml(otp),
        });
      } catch (_) {}

      return res.status(401).json({
        success: false,
        error: "Email not verified. A new OTP has been sent to your email.",
        unverified: true,
        email: user.email,
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res
    .cookie("token", "none", {
      expires: new Date(Date.now() + 5000),
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ success: false, error: "Account not found." });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 600000); // 10 minutes expiry
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset your RJ Developer password",
        message: otpEmailHtml(otp, "Reset Password OTP"),
      });
    } catch (emailErr) {
      return res.status(500).json({ success: false, error: "Could not send email. Please try again." });
    }

    res.status(200).json({ success: true, message: "Reset OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: "All fields (email, otp, newPassword) are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ success: false, error: "Account not found." });
    }

    if (!user.otp || user.otp !== otp.toString()) {
      return res.status(400).json({ success: false, error: "Invalid OTP." });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, error: "OTP has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true; // Mark as verified if they reset password
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful. You can now login." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

module.exports = { register, verifyOTP, resendOTP, login, logout, getMe, forgotPassword, resetPassword };
