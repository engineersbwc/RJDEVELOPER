require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const nodemailer = require("nodemailer");
const passport = require("passport");
require("../config/passportConfig");

const app = express();
app.use(passport.initialize());

// Allowed origins check removed to dynamically allow all Vercel previews
app.use(
  cors({
    origin: (origin, callback) => {
      // Always allow the origin. This automatically echoes the requesting origin
      // so that `credentials: true` works correctly across any Vercel domain.
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/a", (req, res) => {
  res.send("Hello")
})

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Test route as requested by user
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running Successfully"
  });
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, sector, address, message } = req.body || {};

  if (!name || !email || !phone || !sector || !address || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.MAIL_PORT || "587", 10),
    secure: process.env.MAIL_SECURE === "true",
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: `New Lead: ${name} - ${sector}`,
    html: `
      <h2>New Project Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Sector:</strong> ${sector}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Thank you for sharing your project details! We will get back to you soon." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
