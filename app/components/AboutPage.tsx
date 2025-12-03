"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faBolt, 
  faClock, 
  faStar,
  faHeadset,
  faShieldHalved,
  faSun,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";

export default function AboutPage() {
  return (
    <section className="about-page">
      <div className="blog-container">
        {/* Hero Section */}
        <section className="blog-hero-section">
          <h1 className="blog-title">About Likes.io</h1>
          <p className="blog-subtitle">
            We're a team of digital strategists, engineers, and creatives passionate about empowering creators and brands to achieve their full potential on social media.
          </p>
        </section>

        {/* Our Story Section */}
        <div className="about-story">
          <h2 className="about-section-title">Our Story: From Idea to Impact</h2>
          
          <div className="story-content">
            <div className="story-item">
              <h3 className="story-subtitle">Our Beginnings</h3>
              <p className="story-text">
                Likes.io was born from a simple observation: countless talented creators and innovative brands were getting lost in the noise of oversaturated social media feeds. We saw incredible content go unnoticed and great businesses struggle to build the initial credibility needed to attract an organic audience. We knew there had to be a better way to kickstart growth.
              </p>
            </div>

            <div className="story-item">
              <h3 className="story-subtitle">Our Mission</h3>
              <p className="story-text">
                Our mission is to democratize social influence. We provide the critical boost needed to break through the algorithm's barrier, delivering high-quality engagement that builds immediate social proof. By doing this, we empower our clients to capture the attention of their target audience, foster authentic growth, and build lasting credibility in their niche.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="about-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="stat-number">500,000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <div className="stat-number">1,500,000,000+</div>
              <div className="stat-label">Interactions Delivered</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="stat-number">10+</div>
              <div className="stat-label">Years of Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <div className="stat-number">4.9</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="about-values">
          <h2 className="about-section-title">Our Core Values</h2>
          <p className="values-subtitle">
            These principles guide everything we do, from the services we build to the support we provide.
          </p>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FontAwesomeIcon icon={faHeadset} />
              </div>
              <h3 className="value-title">Customer-Centric Support</h3>
              <p className="value-text">
                Your success is our top priority. Our dedicated, 24/7 global support team is always ready to provide expert assistance and ensure a seamless experience.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <h3 className="value-title">Unwavering Integrity</h3>
              <p className="value-text">
                We believe in transparent and ethical growth. We never ask for your password, and our secure methods are designed to protect your account's integrity at all times.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FontAwesomeIcon icon={faSun} />
              </div>
              <h3 className="value-title">Continuous Innovation</h3>
              <p className="value-text">
                The social media landscape is always changing. We are committed to constantly evolving our services to provide you with the most effective, cutting-edge growth solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="about-team">
          <h2 className="about-section-title">Meet the Experts Behind Your Growth</h2>
          <p className="team-subtitle">
            We're a diverse team of specialists dedicated to your success. Get to know the people who make it all happen.
          </p>
          <div className="team-cta">
            <a href="/team" className="team-button">
              Meet Our Team <FontAwesomeIcon icon={faAngleRight} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

