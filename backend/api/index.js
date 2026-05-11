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

// ── ENVIRONMENT VALIDATION ───────────────────────────────────────────────
const validateEnvironment = () => {
  const required = ["MONGO_URI", "JWT_SECRET", "MAIL_USER", "MAIL_PASS"];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`\n❌ CRITICAL: Missing required environment variables: ${missing.join(", ")}`);
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing env vars: ${missing.join(", ")}`);
    }
  }

  const warnings = [];
  if (!process.env.FRONTEND_URL && !process.env.CLIENT_URL) {
    warnings.push("FRONTEND_URL or CLIENT_URL");
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    warnings.push("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
  }
  if (!process.env.JWT_SECRET) {
    warnings.push("JWT_SECRET (critical)");
  }

  if (warnings.length > 0) {
    console.warn(`\n⚠️ WARNING: Consider setting these variables for full functionality: ${warnings.join(", ")}`);
  }
};

validateEnvironment();

// ── SECURITY & MIDDLEWARE SETUP ──────────────────────────────────────────
app.set("trust proxy", 1);
app.use(passport.initialize());

// Detect environment
const isProd = process.env.VERCEL === "1";
console.log(`VERCEL env: ${process.env.VERCEL}, isProd: ${isProd}`);
const frontendOrigin = process.env.FRONTEND_URL || process.env.CLIENT_URL;

// Build allowed origins with proper validation
const allowedOrigins = [];
if (frontendOrigin) {
  allowedOrigins.push(frontendOrigin.replace(/\/+$/, "")); // Remove trailing slashes
}
// In production on Vercel, also allow the Vercel preview deployments and production URL
if (isProd) {
  // Allow all *.vercel.app domains (safer than before as it's more restrictive)
  // Also allow localhost for development when needed
} else {
  allowedOrigins.push("localhost:3000", "localhost:5173", "127.0.0.1:3000", "127.0.0.1:5173");
}

console.log(`🔒 CORS: isProd=${isProd}, allowedOrigins=[${allowedOrigins.join(", ")}]`);

// ── CORS CONFIGURATION ───────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, health checks)
      if (!origin) return callback(null, true);

      if (isProd) {
        // Stricter check in production
        const isAllowed = 
          allowedOrigins.includes(origin) || 
          origin.endsWith(".vercel.app") || 
          origin === frontendOrigin;

        if (isAllowed) {
          callback(null, true);
        } else {
          console.warn(`🚫 CORS BLOCKED: ${origin}`);
          callback(new Error("CORS policy: origin not allowed"));
        }
      } else {
        // Allow all in development
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["X-Total-Count"],
    maxAge: 86400, // 24 hours
  })
);

// ── BODY PARSING & COOKIES ───────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// ── CONNECTION TIMEOUT WRAPPER ───────────────────────────────────────────
const withDBConnection = (fn) => {
  return async (req, res, next) => {
    try {
      // Set a reasonable timeout for DB connection attempts
      const connectPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database connection timeout")), 8000)
      );

      await Promise.race([connectPromise, timeoutPromise]);
      next();
    } catch (err) {
      console.error(`❌ Database connection failed for ${req.method} ${req.path}:`, err.message);
      return res.status(503).json({
        success: false,
        error: "Database temporarily unavailable. Please try again in a moment.",
        details: isProd ? undefined : err.message,
      });
    }
  };
};

// ── APPLY DB MIDDLEWARE TO PROTECTED ROUTES ──────────────────────────────
// Skip DB connection for public health/status endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running Successfully",
    timestamp: new Date().toISOString(),
    environment: isProd ? "production" : "development",
  });
});

app.get("/a", (req, res) => {
  res.send("Hello");
});

// ── AUTH ROUTES WITH DB CONNECTION ──────────────────────────────────────
app.use("/api/auth", withDBConnection(), (req, res, next) => {
  console.log(`🔌 Auth Route: ${req.method} ${req.path}`);
  next();
}, authRoutes);

app.use("/auth", withDBConnection(), (req, res, next) => {
  console.log(`🔌 Legacy Auth Route: ${req.method} ${req.path}`);
  next();
}, authRoutes);

// ── CONTACT FORM ENDPOINT ───────────────────────────────────────────────
app.post("/api/contact", withDBConnection(), async (req, res) => {
  try {
    const { name, email, phone, sector, address, message } = req.body || {};

    // Validate inputs
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !sector?.trim() || !address?.trim() || !message?.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "All fields are required" 
      });
    }

    // Create transporter with timeout
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

    // Mail content
    const mailOptions = {
      from: `"RJ Developer" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      replyTo: email,
      subject: `New Lead: ${name} - ${sector}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Project Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Sector:</td><td style="padding: 8px;">${escapeHtml(sector)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Address:</td><td style="padding: 8px;">${escapeHtml(address)}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${escapeHtml(message).replace(/\n/g, "<br>")}</td></tr>
          </table>
        </div>
      `,
    };

    // Send with timeout using AbortController pattern
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email send timeout")), 8000)
    );

    await Promise.race([sendPromise, timeoutPromise]);

    res.status(200).json({ 
      success: true,
      message: "Thank you for sharing your project details! We will get back to you soon." 
    });
  } catch (error) {
    console.error("❌ Contact form error:", error.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to send message. Please try again later." 
    });
  }
});

// ── ERROR HANDLING MIDDLEWARE ───────────────────────────────────────────
app.use((req, res) => {
  // 404 handler
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    path: req.path,
  });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.message);
  console.error(err.stack);

  // Handle specific error types
  if (err.message === "CORS policy: origin not allowed") {
    return res.status(403).json({
      success: false,
      error: "CORS error: Request origin not allowed",
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    ...(isProd ? {} : { path: req.path, stack: err.stack }),
  });
});

// ── GRACEFUL SHUTDOWN ───────────────────────────────────────────────────
const handleShutdown = async (signal) => {
  console.log(`\n📴 Received ${signal}, shutting down gracefully...`);
  try {
    const connectDB = require("../config/db");
    if (connectDB.disconnectDB) {
      await connectDB.disconnectDB();
    }
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err.message);
    process.exit(1);
  }
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

// ── LOCAL DEVELOPMENT SERVER ────────────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Backend running on http://0.0.0.0:${PORT}`);
    console.log(`Environment: ${isProd ? "production" : "development"}`);
  });
}

// ── SECURITY HELPER ─────────────────────────────────────────────────────
const escapeHtml = (text) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

module.exports = app;
