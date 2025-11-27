"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export type ReviewItem = {
  handle: string;
  role: string;
  text: string;
};

type ReviewsSectionProps = {
  title?: string;
  subtitle?: string;
  reviews?: ReviewItem[];
};

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    handle: "@sarahL",
    role: "Verified Buyer",
    text:
      "Likes.io changed the game for my channel. The growth felt natural and the engagement was top-notch. I saw results within the first 24 hours!",
  },
  {
    handle: "@MikeP_Fitness",
    role: "Verified Buyer",
    text:
      "As a business, establishing social proof is key. The immediate trust we got from buying followers helped us increase conversions by 30%. Incredibly simple and effective.",
  },
  {
    handle: "@JessT_Art",
    role: "Verified Buyer",
    text:
      "I was skeptical at first, but the quality of the likes is undeniable. It helped my art reach a much wider audience than I could have managed on my own. Highly recommended!",
  },
];

export default function ReviewsSection({
  title = "Loved by Creators Worldwide",
  subtitle = "Real reviews from creators and brands who've seen incredible growth with our service.",
  reviews = DEFAULT_REVIEWS,
}: ReviewsSectionProps) {
  const [index, setIndex] = useState(0);

  const total = reviews.length;
  const CARD_W = 344; // card width used for sliding (desktop)
  const GAP = 24; // spacing between cards in the track
  const VISIBLE = 3; // show three cards per view
  const STEP_W = CARD_W + GAP; // pixels to move per step (one card at a time)
  const MAX_INDEX = Math.max(0, total - 1); // allow scrolling to show last card

  const next = () => setIndex((i) => Math.min(i + 1, MAX_INDEX));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <section className="reviews">
      <div className="container">
        <h2 className="reviews-title">{title}</h2>
        <p className="reviews-sub">{subtitle}</p>

        <div className="reviews-wrap">
          <button className={`reviews-nav left ${index === 0 ? "disabled" : ""}`} aria-label="Previous" aria-disabled={index===0} onClick={prev}>←</button>
          <div className="reviews-viewport" style={{ width: `${VISIBLE * CARD_W + (VISIBLE - 1) * GAP}px` }}>
            <div className="reviews-track" style={{ transform: `translateX(-${index * STEP_W}px)` }}>
              {reviews.map((r, idx) => (
                <article className="review-card" key={idx}>
                  <div className="review-top">
                    <div className="avatar" />
                    <div className="meta">
                      <div className="handle">{r.handle}</div>
                      <div className="verified">
                        <span className="check">✓</span> {r.role}
                      </div>
                    </div>
                  </div>
                  <div className="stars">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <p className="review-text">{r.text}</p>
                </article>
              ))}
            </div>
          </div>
          <button className={`reviews-nav right ${index >= MAX_INDEX ? "disabled" : ""}`} aria-label="Next" aria-disabled={index>=MAX_INDEX} onClick={next}>→</button>
        </div>

        <div className="reviews-dots">
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} className={`dot ${i === index ? "active" : ""}`} aria-label={`Go to slide ${i+1}`} onClick={() => setIndex(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}