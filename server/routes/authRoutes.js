import "../config/env.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../config/db.js";

const router = express.Router();


// ==========================================
// SIGNUP
// POST /api/auth/signup
// ==========================================

router.post("/signup", async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = req.body;


    // ======================================
    // CHECK ALL FIELDS
    // ======================================

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }


    // ======================================
    // CHECK PASSWORDS MATCH
    // ======================================

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }


    // ======================================
    // CHECK PASSWORD LENGTH
    // ======================================

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }


    // ======================================
    // NORMALIZE EMAIL
    // ======================================

    const normalizedEmail = email
      .trim()
      .toLowerCase();


    // ======================================
    // CHECK IF EMAIL ALREADY EXISTS
    // ======================================

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }


    // ======================================
    // HASH PASSWORD
    // ======================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // ======================================
    // INSERT USER INTO MYSQL
    // ======================================

    const [result] = await db.query(
      `INSERT INTO users
       (first_name, last_name, email, password)
       VALUES (?, ?, ?, ?)`,
      [
        firstName.trim(),
        lastName.trim(),
        normalizedEmail,
        hashedPassword,
      ]
    );


    // ======================================
    // SIGNUP SUCCESS
    // ======================================

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",

      user: {
        id: result.insertId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
      },
    });

  } catch (error) {

    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating account.",
    });
  }
});


// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // ======================================
    // CHECK REQUIRED FIELDS
    // ======================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }


    // ======================================
    // NORMALIZE EMAIL
    // ======================================

    const normalizedEmail = email
      .trim()
      .toLowerCase();


    // ======================================
    // FIND USER IN MYSQL
    // ======================================

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [normalizedEmail]
    );


    // ======================================
    // USER NOT FOUND
    // ======================================

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }


    const user = users[0];


    // ======================================
    // COMPARE PASSWORD WITH BCRYPT HASH
    // ======================================

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );


    // ======================================
    // WRONG PASSWORD
    // ======================================

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }


    // ======================================
    // CREATE JWT TOKEN
    // ======================================

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    // ======================================
    // LOGIN SUCCESS
    // ======================================

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token,

      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while logging in.",
    });
  }
});


export default router;