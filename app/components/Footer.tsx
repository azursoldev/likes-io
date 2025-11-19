export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        {/* Top row nav */}
        <div className="footer-top">
          <nav className="footer-top-nav">
            <a href="#faq">FAQ</a>
            <a href="#blog">Blog</a>
            <a href="#about">About Us</a>
            <a href="#team">Our Team</a>
            <a href="#contact">Contact Us</a>
            <a href="#tos">Terms of Service</a>
            <a href="#privacy">Privacy Policy</a>
          </nav>
          <div className="footer-lang">
            <button className="lang-btn" aria-label="Change language">
              <span className="flag" aria-hidden>
                🇺🇸
              </span>
              <span className="lang-label">English</span>
              <span className="caret" aria-hidden>▾</span>
            </button>
          </div>
        </div>

        <div className="footer-divider" />

        {/* Columns */}
        <div className="footer-columns">
          <div className="f-col">
            <h4>Instagram Services</h4>
            <ul>
              <li><a href="#">Buy Instagram Likes</a></li>
              <li><a href="#">Buy Instagram Followers</a></li>
              <li><a href="#">Buy Instagram Views</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>TikTok Services</h4>
            <ul>
              <li><a href="#">Buy TikTok Likes</a></li>
              <li><a href="#">Buy TikTok Followers</a></li>
              <li><a href="#">Buy TikTok Views</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>YouTube Services</h4>
            <ul>
              <li><a href="#">Buy YouTube Views</a></li>
              <li><a href="#">Buy YouTube Subscribers</a></li>
              <li><a href="#">Buy YouTube Likes</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Tools & Resources</h4>
            <ul>
              <li><a href="#">Free Instagram Likes</a></li>
              <li><a href="#">Free Instagram Followers</a></li>
              <li><a href="#">Reviews</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>My Account</h4>
            <ul>
              <li><a href="#">Log In</a></li>
              <li><a href="#">Sign Up</a></li>
            </ul>
          </div>
          <div className="f-col">
            <h4>Affiliate Program</h4>
            <ul>
              <li><a href="#">Become an Affiliate</a></li>
              <li>
                <a href="#" className="login-link">Log in</a>
                <span className="login-note"> to view stats.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="brand">
            <span className="logo-text">Likes</span>
            <span className="logo-dot">.io</span>
          </div>
          <p className="copyright">
            Copyright © {year} Likes.io. All Rights Reserved. — Last Page Ltd. (HE470127), Nicosia, Cyprus.
          </p>
        </div>
      </div>
    </footer>
  );
}