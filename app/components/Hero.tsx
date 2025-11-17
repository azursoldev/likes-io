export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-left">
          <h1 className="font-heading hero-title">
            Real Social Media
            <br />
            Growth, <span className="accent">Delivered</span>
            <span className="accent"> Instantly!</span>
          </h1>
          <p className="hero-sub">
            Get real, high-quality likes, followers, and views to boost your
            social presence, reach the Explore Page, and grow your brand
            organically.
          </p>
          <div className="reviews-pill">
            <span className="star">★</span>
            <span className="score">5.0</span>
            <span className="sep">•</span>
            <span className="count">1,442+ Reviews</span>
          </div>
          <div className="cta">
            <button className="btn dark">View Packages</button>
            <button className="btn light">Free Likes Trial</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar" />
              <div className="profile-meta">
                <div className="handle">@yourprofile</div>
                <div className="role">Lifestyle Creator</div>
              </div>
            </div>
            <div className="profile-image" />
            <div className="stats-row">
              <div className="stat">
                <div className="val">1,258</div>
                <div className="label">Likes</div>
              </div>
              <div className="stat">
                <div className="val">15.2k</div>
                <div className="label">Followers</div>
              </div>
              <div className="stat">
                <div className="val">3.4%</div>
                <div className="label">Engagement</div>
              </div>
            </div>
            <div className="delivered-badge">+350 Followers<span className="sub"> delivered</span></div>
            <div className="likes-float">❤ +1.2k Likes <span className="sub">in 5 minutes</span></div>
          </div>
        </div>
      </div>
      <div className="social-update">
        <span className="pill">
          <span className="ig-logo" aria-hidden="true" />
          <span className="handle">@fitfoodie</span>
        </span>
        <span className="muted">just purchased</span>
        <b className="accent-num">5,000 Followers</b>
        <span className="time">1m ago</span>
      </div>
    </section>
  );
}