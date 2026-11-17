import { useState } from "react";
import { API_BASE_URL } from "../config/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/contact`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent successfully.");

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus(data.message || "Unable to send message.");
      }
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus(
        "Unable to connect to the server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="bg-light">
      <div className="container">

        <h2 className="text-center mb-4">
          Contact a Travel Researcher
        </h2>

        <p className="text-center mb-5 contact-caption">
          We always aim to reply within 24 hours.
        </p>

        <div className="row justify-content-center g-4">

          {/* Phone */}
          <div className="col-md-4 text-center c-box">
            <div className="contact-box">

              <i className="fas fa-phone fa-3x mb-3"></i>

              <h3>Call Us</h3>

              <p>+91 9876543210</p>

              <span>We are online now</span>

            </div>
          </div>

          {/* Email */}
          <div className="col-md-4 text-center c-box">
            <div className="contact-box">

              <i className="fas fa-envelope fa-3x mb-3"></i>

              <h3>Email Us</h3>

              <p>contact@sanchari.com</p>

              <span>Get reply within 24 hours</span>

            </div>
          </div>

          {/* Location */}
          <div className="col-md-4 text-center c-box">
            <div className="contact-box">

              <i className="fas fa-map-marker-alt fa-3x mb-3"></i>

              <h3>Visit Us</h3>

              <p>123, Main Street, City</p>

              <span>9 AM - 6 PM</span>

            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">

            <div className="contact-form-box">

              <h3 className="text-center mb-4">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label htmlFor="name">
                    Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="form-control"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Sending..."
                    : "Send Message"}
                </button>

                {status && (
                  <p className="text-center mt-3">
                    {status}
                  </p>
                )}

              </form>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Contact;