export default function MoreServicesCTA() {
  return (
    <section className="more-services">
      <div className="container">
        <div className="ms-header">
          <h2 className="ms-title">
            More Growth <span className="accent">Services</span> from Likes.io
          </h2>
          <p className="ms-sub">
            Instagram likes are powerful tools, but they’re not the only engagements available from Likes.io. We
            offer more growth services that can rapidly boost your Instagram fan base or engagement rates even more.
            Please give them a try to see how quickly you can become popular and important on the app!
          </p>
        </div>

        <div className="ms-actions">
          <a href="/instagram/followers" className="ms-btn grad-violet">
            <span className="ms-icon"><img src="/avatar.svg" alt="Followers" width={18} height={18} /></span>
            <span className="ms-label">BUY FOLLOWERS</span>
            <span className="arrow" aria-hidden="true"></span>
          </a>
          <a href="/instagram/views" className="ms-btn grad-pink">
            <span className="ms-icon"><img src="/eye-2.svg" alt="Views" width={18} height={18} /></span>
            <span className="ms-label">BUY VIEWS</span>
            <span className="arrow" aria-hidden="true"></span>
          </a>
        </div>
      </div>
    </section>
  );
}