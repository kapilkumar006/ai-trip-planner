import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const isScrollingRef = useRef(false);

  const { user, isAuthenticated, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  // Handle scrolling to a section when arriving from another page
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const { scrollTo, sectionName } = location.state;
      if (sectionName) {
        setActiveSection(sectionName);
      }
      isScrollingRef.current = true;
      const timer = setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [location]);

  // Scroll spy for sections when on home page ("/")
  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      if (window.scrollY < 200) {
        setActiveSection("home");
        return;
      }

      const scrollPosition = window.scrollY + 250;
      const contactSection = document.getElementById("contact-section");
      const servicesSection = document.getElementById("services-container");
      const aboutSection = document.getElementById("aboutus-container");

      if (contactSection && scrollPosition >= contactSection.offsetTop) {
        setActiveSection("contact");
      } else if (servicesSection && scrollPosition >= servicesSection.offsetTop) {
        setActiveSection("services");
      } else if (aboutSection && scrollPosition >= aboutSection.offsetTop) {
        setActiveSection("about");
      } else {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const handleHomeClick = (event) => {
    if (event) event.preventDefault();
    closeMenu();
    setActiveSection("home");

    if (location.pathname !== "/") {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionClick = (sectionId, sectionName) => {
    closeMenu();
    setActiveSection(sectionName);

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId, sectionName } });
      return;
    }

    isScrollingRef.current = true;
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  };

  const isHomeActive = location.pathname === "/" && activeSection === "home";
  const isDestinationsActive = location.pathname === "/destinations";
  const isAboutActive = location.pathname === "/" && activeSection === "about";
  const isServicesActive = location.pathname === "/" && activeSection === "services";
  const isContactActive = location.pathname === "/" && activeSection === "contact";
  const isMyTripsActive = location.pathname === "/my-trips";

  return (
    <nav className="sanchari-navbar">
      <div className="sanchari-nav-container">

        {/* LOGO */}
        <Link
          className="sanchari-brand"
          to="/"
          onClick={handleHomeClick}
          aria-label="Sanchari Home"
        >
          <img src="/assets/pics/logo.jpeg" alt="Sanchari Logo" />
          <span className="sanchari-brand-text">Sanchari</span>
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className={`sanchari-menu-toggle ${menuOpen ? "open" : ""}`}
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-controls="sanchari-navigation"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAVIGATION */}
        <div
          className={`sanchari-navigation ${menuOpen ? "is-open" : ""}`}
          id="sanchari-navigation"
        >
          <ul className="sanchari-nav-links">

            <li>
              <Link
                className={`sanchari-nav-link ${isHomeActive ? "active" : ""}`}
                to="/"
                onClick={handleHomeClick}
              >
                <i className="fas fa-home nav-btn-icon"></i>
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                className={`sanchari-nav-link ${isDestinationsActive ? "active" : ""}`}
                to="/destinations"
                onClick={() => {
                  closeMenu();
                  setActiveSection("");
                }}
              >
                <i className="fas fa-map-marker-alt nav-btn-icon"></i>
                <span>Destinations</span>
              </Link>
            </li>

            <li>
              <button
                className={`sanchari-nav-link ${isAboutActive ? "active" : ""}`}
                type="button"
                onClick={() => handleSectionClick("aboutus-container", "about")}
              >
                <i className="fas fa-info-circle nav-btn-icon"></i>
                <span>About</span>
              </button>
            </li>

            <li>
              <button
                className={`sanchari-nav-link ${isServicesActive ? "active" : ""}`}
                type="button"
                onClick={() => handleSectionClick("services-container", "services")}
              >
                <i className="fas fa-concierge-bell nav-btn-icon"></i>
                <span>Services</span>
              </button>
            </li>

            <li>
              <button
                className={`sanchari-nav-link ${isContactActive ? "active" : ""}`}
                type="button"
                onClick={() => handleSectionClick("contact-section", "contact")}
              >
                <i className="fas fa-envelope nav-btn-icon"></i>
                <span>Contact</span>
              </button>
            </li>

            {!isAuthenticated ? (
              <>
                <li>
                  <Link
                    className={`sanchari-nav-link ${
                      location.pathname === "/login" ? "active" : ""
                    }`}
                    to="/login"
                    onClick={() => {
                      closeMenu();
                      setActiveSection("");
                    }}
                  >
                    <i className="fas fa-sign-in-alt nav-btn-icon"></i>
                    <span>Log In</span>
                  </Link>
                </li>

                <li>
                  <Link
                    className="sanchari-signup-btn"
                    to="/signup"
                    onClick={() => {
                      closeMenu();
                      setActiveSection("");
                    }}
                  >
                    Get Started <span>↗</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className={`sanchari-mytrips-btn ${isMyTripsActive ? "active" : ""}`}
                    to="/my-trips"
                    onClick={() => {
                      closeMenu();
                      setActiveSection("");
                    }}
                  >
                    <i className="fas fa-plane nav-btn-icon mytrips-icon"></i>
                    <span>My Trips</span>
                  </Link>
                </li>

                <li>
                  <span className="sanchari-user-greeting">
                    <span className="user-avatar">
                      {(user?.firstName || "T").charAt(0).toUpperCase()}
                    </span>
                    <span>
                      Hi, {user?.firstName || "Traveler"}
                    </span>
                  </span>
                </li>

                <li>
                  <button
                    className="sanchari-logout-btn"
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                      navigate("/");
                    }}
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
