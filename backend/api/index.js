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
app.set('trust proxy', 1);
app.use(passport.initialize());

const frontendOrigin = process.env.FRONTEND_URL || process.env.CLIENT_URL;

if (process.env.NODE_ENV === 'production' && !frontendOrigin) {
  console.warn('⚠️ FRONTEND_URL or CLIENT_URL not set in production. CORS may reject requests.');
}

const allowedOrigins = [frontendOrigin].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (process.env.NODE_ENV === 'production') {
        const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
        if (isAllowed) {
          callback(null, true);
        } else {
          console.warn(`Blocked by CORS: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/a", (req, res) => {
  res.send("Hello")
})

app.use(async (req, res, next) => {
  // Skip DB connection for health checks if needed, or keep it to verify DB health
  if (req.path === '/api/health') return next();

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Critical: Database connection failed in middleware:", err.message);
    res.status(503).json({ 
      success: false, 
      error: "Database connection failed. Please check if your IP is whitelisted in MongoDB Atlas.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
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
  console.error("Unhandled Error Stack:", err.stack);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: "CORS error: Origin not allowed."
    });
  }

  res.status(err.status || 500).json({ 
    success: false, 
    error: err.message || "Internal Server Error",
    path: req.path
  });
});


if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running on port ${PORT}`);
  });
}

module.exports = app;
