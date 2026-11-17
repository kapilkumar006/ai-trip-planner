import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/Auth.css";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // =========================================
  // LOGIN FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =========================================
  // PASSWORD VISIBILITY
  // =========================================

  const [showPassword, setShowPassword] = useState(false);

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
  // HANDLE LOGIN
  // =========================================

  const handleSubmit = async (event) => {
  event.preventDefault();

  const result = await login(
    formData.email,
    formData.password
  );

  if (!result.success) {
    alert(result.message);
    return;
  }

  const destination =
    location.state?.from || "/";

  navigate(destination, {
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
            <span className="logo-icon">✦</span>
            Sanchari
          </div>


          {/* Image Text */}

          <div className="auth-image-content">

            <div className="small-line"></div>

            <h1>
              Your Journey
              <br />
              Starts Here
            </h1>

            <p>
              AI-powered travel planning
              <br />
              for your next adventure.
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
            RIGHT LOGIN SECTION
            ========================================= */}

        <section className="auth-form-section">

          <div className="auth-form-content">


            {/* =========================================
                SIGN UP / LOGIN TOGGLE
                ========================================= */}

            <div className="auth-toggle">

              {/* SIGN UP */}

              <button
                type="button"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>


              {/* LOGIN - ACTIVE */}

              <button
                type="button"
                className="auth-toggle-active"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>

            </div>


            {/* =========================================
                TITLE
                ========================================= */}

            <h2>
              Welcome Back
            </h2>

            <p className="auth-subtitle">
              Log in to continue planning your journey
            </p>


            {/* =========================================
                LOGIN FORM
                ========================================= */}

            <form onSubmit={handleSubmit}>


              {/* EMAIL */}

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


              {/* PASSWORD */}

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


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="auth-submit"
              >
                Log In
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
                SOCIAL LOGIN
                ========================================= */}

            <div className="social-buttons">

              <button
                type="button"
                onClick={() =>
                  alert("Google login will be added later.")
                }
              >
                G
              </button>

              <button
                type="button"
                onClick={() =>
                  alert("Facebook login will be added later.")
                }
              >
                f
              </button>

              <button
                type="button"
                onClick={() =>
                  alert("Apple login will be added later.")
                }
              >
                
              </button>

            </div>


            {/* =========================================
                SWITCH TO SIGNUP
                ========================================= */}

            <button
              type="button"
              className="auth-home-link"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </button>

            <p className="switch-auth">

              Don't have an account?

              <button
                type="button"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>

            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Login;