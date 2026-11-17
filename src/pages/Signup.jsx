import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Auth.css";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  // =========================================
  // SIGNUP FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =========================================
  // PASSWORD VISIBILITY
  // =========================================

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================
  // AUTH IMAGES
  // =========================================

  const images = [
    "/assets/pics/auth/auth1.jpg",
    "/assets/pics/auth/auth2.jpg",
    "/assets/pics/auth/auth3.jpg",
    "/assets/pics/auth/auth4.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  // =========================================
  // CHANGE IMAGE EVERY 10 SECONDS
  // =========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((previousImage) => {
        return (previousImage + 1) % images.length;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE SIGNUP
  // =========================================

  const handleSubmit = async (event) => {
  event.preventDefault();

  // Check passwords match
  if (
    formData.password !==
    formData.confirmPassword
  ) {
    alert("Passwords do not match.");
    return;
  }

  // Minimum 8 characters
  if (formData.password.length < 8) {
    alert(
      "Password must be at least 8 characters."
    );
    return;
  }

  const result = await signup(formData);

  if (!result.success) {
    alert(result.message);
    return;
  }

  alert(
    "Account created successfully. Please log in."
  );

  navigate("/login", {
    replace: true,
  });
};

  return (
    <main className="auth-page">

      <div className="auth-card">

        {/* =========================================
            LEFT IMAGE SECTION
            ========================================= */}

        <section
          className="auth-image-section"
          style={{
            backgroundImage: `
              linear-gradient(
                to top,
                rgba(0, 0, 0, 0.75),
                rgba(0, 0, 0, 0.05) 65%
              ),
              url("${images[currentImage]}")
            `,
          }}
        >

          {/* Logo */}

          <div className="auth-logo">

            <span className="logo-icon">
              ✦
            </span>

            Sanchari

          </div>


          {/* Image Text */}

          <div className="auth-image-content">

            <div className="small-line"></div>

            <h1>
              Plan Your
              <br />
              Adventure
            </h1>

            <p>
              Discover destinations and create
              <br />
              unforgettable trips with AI.
            </p>

          </div>


          {/* Image Dots */}

          <div className="auth-image-dots">

            {images.map((image, index) => (
              <span
                key={image}
                className={`auth-image-dot ${
                  currentImage === index ? "active" : ""
                }`}
              ></span>
            ))}

          </div>

        </section>


        {/* =========================================
            RIGHT SIGNUP SECTION
            ========================================= */}

        <section className="auth-form-section">

          <div className="auth-form-content">


            {/* =========================================
                SIGN UP / LOGIN TOGGLE
                ========================================= */}

            <div className="auth-toggle">

              {/* SIGN UP - ACTIVE */}

              <button
                type="button"
                className="auth-toggle-active"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>


              {/* LOGIN */}

              <button
                type="button"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>

            </div>


            {/* =========================================
                TITLE
                ========================================= */}

            <h2>
              Create An Account
            </h2>

            <p className="auth-subtitle">
              Start planning your perfect trip with AI
            </p>


            {/* =========================================
                SIGNUP FORM
                ========================================= */}

            <form onSubmit={handleSubmit}>


              {/* =========================================
                  FIRST NAME + LAST NAME
                  ========================================= */}

              <div className="name-row">

                {/* FIRST NAME */}

                <div className="auth-input">

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                  />

                </div>


                {/* LAST NAME */}

                <div className="auth-input">

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                  />

                </div>

              </div>


              {/* =========================================
                  EMAIL
                  ========================================= */}

              <div className="auth-input">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  required
                />

              </div>


              {/* =========================================
                  PASSWORD
                  ========================================= */}

              <div className="auth-input">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  minLength="8"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>


              {/* =========================================
                  CONFIRM PASSWORD
                  ========================================= */}

              <div className="auth-input">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  minLength="8"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>

              </div>


              {/* =========================================
                  SIGNUP BUTTON
                  ========================================= */}

              <button
                type="submit"
                className="auth-submit"
              >
                Create an Account
              </button>

            </form>


            {/* =========================================
                DIVIDER
                ========================================= */}

            <div className="auth-divider">

              <span></span>

              <p>Or</p>

              <span></span>

            </div>


            {/* =========================================
                SOCIAL SIGNUP
                ========================================= */}

            <div className="social-buttons">

              <button
                type="button"
                onClick={() =>
                  alert("Google signup will be added later.")
                }
              >
                G
              </button>

              <button
                type="button"
                onClick={() =>
                  alert("Facebook signup will be added later.")
                }
              >
                f
              </button>

              <button
                type="button"
                onClick={() =>
                  alert("Apple signup will be added later.")
                }
              >
                
              </button>

            </div>


            {/* =========================================
                SWITCH TO LOGIN
                ========================================= */}

            <button
              type="button"
              className="auth-home-link"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>

            <p className="switch-auth">

              Already have an account?

              <button
                type="button"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Signup;