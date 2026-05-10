import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "../config/db";
import authRoutes from "../routes/authRoutes";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow requests from the deployed frontend URL and localhost for dev
const allowedOrigins = [
  process.env.FRONTEND_URL || "",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ── DB Middleware (serverless-safe connection pooling) ────────────────────────
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

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
  } catch (error: any) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

// ── Local dev: listen directly; Vercel: export the app ───────────────────────
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
  });
}

export default app;
