import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Contact Form
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, sector, address, message } = req.body;

    if (!name || !email || !phone || !sector || !address || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const hasAuth = process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS;

      if (hasAuth) {
        const transporter = nodemailer.createTransport({
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT || "587"),
          secure: process.env.MAIL_SECURE === "true",
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"RJ Developer Contact" <${process.env.MAIL_USER}>`,
          to: process.env.MAIL_USER, 
          subject: `New Project Inquiry from ${name} (${sector})`,
          text: `
            Name: ${name}
            Email: ${email}
            Phone: ${phone}
            Sector: ${sector}
            Address: ${address}
            
            About Project:
            ${message}
          `,
          html: `
            <h3>New Project Inquiry</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Sector:</strong> ${sector}</p>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>About Project:</strong></p>
            <p>${message}</p>
          `,
        });
        console.log("Email sent successfully via SMTP");
      } else {
        console.warn("Mail credentials not configured. Mocking success for demo.");
        console.log("Contact Data Received:", { name, email, phone, sector, address, message });
      }

      res.status(200).json({ message: "Thank you for sharing your project details! We will get back to you soon." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
