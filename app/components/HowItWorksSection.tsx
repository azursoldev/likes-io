export default function HowItWorksSection() {
  return (
    <section className="howitworks">
      <div className="container">
        <div className="hw-header">
          <h2 className="hw-title">How It Works</h2>
          <p className="hw-sub">
            Our streamlined process is designed for speed and security. Give your posts the
            engagement they deserve right now.
          </p>
        </div>

        <div className="hw-steps" role="list">
          <div className="hw-step" role="listitem">
            <div className="hw-num" aria-hidden="true">1</div>
            <h3 className="hw-step-title">1. Select Your Package</h3>
            <p className="hw-step-desc">
              Choose from our High-Quality or Premium likes and select the quantity that
              matches your goals.
            </p>
          </div>
          <span className="hw-sep" aria-hidden="true"></span>
          <div className="hw-step" role="listitem">
            <div className="hw-num" aria-hidden="true">2</div>
            <h3 className="hw-step-title">2. Provide Your Post(s)</h3>
            <p className="hw-step-desc">
              Enter your username and select the posts you want to boost. No password
              required, ever.
            </p>
          </div>
          <span className="hw-sep" aria-hidden="true"></span>
          <div className="hw-step" role="listitem">
            <div className="hw-num" aria-hidden="true">3</div>
            <h3 className="hw-step-title">3. Watch the Magic Happen</h3>
            <p className="hw-step-desc">
              Complete the secure checkout and watch as real likes start appearing on your
              posts within minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}