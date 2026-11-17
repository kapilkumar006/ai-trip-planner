import "../config/env.js";
import jwt from "jsonwebtoken";


// ==========================================
// VERIFY JWT TOKEN
// ==========================================

const verifyToken = (req, res, next) => {
  try {

    // Get Authorization header
    const authHeader =
      req.headers.authorization;


    // Check if token exists
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });
    }


    // Extract token
    const token =
      authHeader.split(" ")[1];


    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Store decoded user information
    req.user = decoded;


    // Continue to protected route
    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token.",
    });
  }
};


export default verifyToken;