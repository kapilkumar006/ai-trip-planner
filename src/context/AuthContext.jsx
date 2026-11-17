import {
  createContext,
  useContext,
  useState,
} from "react";

import { API_BASE_URL } from "../config/api";

const AuthContext = createContext(null);

// =========================================
// LOCAL STORAGE KEYS
// =========================================

const CURRENT_USER_KEY = "sanchari_current_user";
const TOKEN_KEY = "sanchari_token";

// =========================================
// BACKEND API
// =========================================

const API_URL = `${API_BASE_URL}/api/auth`;


// =========================================
// AUTH PROVIDER
// =========================================

export function AuthProvider({ children }) {

  // Load logged-in user after refresh
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem(CURRENT_USER_KEY);

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch (error) {

      console.error(
        "Error loading user:",
        error
      );

      return null;
    }
  });


  // =========================================
  // SIGNUP
  // =========================================

  const signup = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }) => {

    try {

      const response = await fetch(
        `${API_URL}/signup`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            "Signup failed.",
        };
      }


      // Signup successful.
      // We do NOT automatically log in here.
      return {
        success: true,
        message:
          data.message ||
          "Account created successfully.",
        user: data.user,
      };

    } catch (error) {

      console.error(
        "Signup error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the server.",
      };
    }
  };


  // =========================================
  // LOGIN
  // =========================================

  const login = async (
    email,
    password
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            "Login failed.",
        };
      }


      // =====================================
      // SAVE JWT TOKEN
      // =====================================

      localStorage.setItem(
        TOKEN_KEY,
        data.token
      );


      // =====================================
      // SAVE CURRENT USER
      // =====================================

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(data.user)
      );


      // Update React authentication state
      setUser(data.user);


      return {
        success: true,
        message:
          data.message ||
          "Login successful.",
        user: data.user,
      };

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      return {
        success: false,
        message:
          "Unable to connect to the server.",
      };
    }
  };


  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {

    localStorage.removeItem(
      TOKEN_KEY
    );

    localStorage.removeItem(
      CURRENT_USER_KEY
    );

    setUser(null);
  };


  // =========================================
  // GET TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem(
      TOKEN_KEY
    );
  };


  // =========================================
  // AUTH CONTEXT
  // =========================================

  return (
    <AuthContext.Provider
      value={{
        user,

        isAuthenticated: !!user,

        signup,

        login,

        logout,

        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// =========================================
// CUSTOM AUTH HOOK
// =========================================

export function useAuth() {

  const context =
    useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }


  return context;
}