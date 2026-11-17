import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ==========================================
// SUBMIT CONTACT FORM MESSAGE
// POST /api/contact
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    await db.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), email.trim(), subject.trim(), message.trim()]
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save message. Please try again later.",
    });
  }
});

export default router;
