"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeadset, 
  faClock, 
  faThumbsUp,
  faAngleRight,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Support",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="contact-page">
      <div className="container">
        <div className="contact-hero">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-description">
            We're here to help. Whether you have a question about our services, a billing inquiry, or just want to say hello, we'd love to hear from you.
          </p>
        </div>

        <div className="contact-content">
          {/* Left Card - We're Here to Help */}
          <div className="contact-help-card">
            <h2 className="contact-card-title">We're Here to Help</h2>
            <p className="contact-card-intro">
              Our support team is ready to assist you. We're committed to providing the best experience possible.
            </p>

            <div className="contact-features">
              <div className="contact-feature">
                <div className="contact-feature-icon contact-feature-icon-orange">
                  <FontAwesomeIcon icon={faHeadset} />
                </div>
                <div className="contact-feature-content">
                  <h3 className="contact-feature-title">24/7 Expert Support</h3>
                  <p className="contact-feature-text">
                    Our dedicated team is available around the clock to assist you with any questions or issues.
                  </p>
                </div>
              </div>

              <div className="contact-feature">
                <div className="contact-feature-icon contact-feature-icon-blue">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div className="contact-feature-content">
                  <h3 className="contact-feature-title">Fast Response Times</h3>
                  <p className="contact-feature-text">
                    We pride ourselves on quick replies. You can expect to hear back from us within just a few hours.
                  </p>
                </div>
              </div>

              <div className="contact-feature">
                <div className="contact-feature-icon contact-feature-icon-green">
                  <FontAwesomeIcon icon={faThumbsUp} />
                </div>
                <div className="contact-feature-content">
                  <h3 className="contact-feature-title">Satisfaction Guarantee</h3>
                  <p className="contact-feature-text">
                    Your success is our mission. We're not happy unless you are completely satisfied with our service.
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-email-section">
              <p className="contact-email-text">Prefer to email us directly?</p>
              <a href="mailto:support@likes.io" className="contact-email-link">
                <FontAwesomeIcon icon={faEnvelope} />
                support@likes.io
              </a>
            </div>
          </div>

          {/* Right Card - Send a Message */}
          <div className="contact-form-card">
            <h2 className="contact-card-title">Send a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <label htmlFor="name" className="contact-form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="contact-form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="email" className="contact-form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="contact-form-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject" className="contact-form-label">What can we help with?</label>
                <select
                  id="subject"
                  name="subject"
                  className="contact-form-select"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="Order Support">Order Support</option>
                  <option value="Billing Inquiry">Billing Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="General Question">General Question</option>
                  <option value="Feedback">Feedback</option>
                </select>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message" className="contact-form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="contact-form-textarea"
                  placeholder="How can we help you?"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="contact-form-submit">
                Send Message
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

