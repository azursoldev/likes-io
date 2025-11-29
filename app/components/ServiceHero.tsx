"use client";
import Script from "next/script";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
export default function ServiceHero({
  title,
  subtitle,
  rating = "4.9/5",
  basedon = "based on",
  reviewss,
  reviews,
}: {
  title: string;
  subtitle: string;
  rating?: string;
  basedon?: string;
  reviewss?: string;
  reviews?: string;
}) {
  const reviewText = reviewss || reviews || "1,352+ reviews";
  return (
    <section className="hero-section service-hero">
      
      <div className="container hero-grid">
        <div className="hero-left">
          <h1 className="font-heading hero-title" style={{ margin: "0" }}>{title}</h1>
          <p className="hero-sub" style={{ textAlign: "center", maxWidth: "56rem" }}>{subtitle}</p>
          <div className="reviews-pill" style={{ justifyContent: "center" }}>
            <div className="stars-container">
                 <span className="star" aria-hidden>
              <FontAwesomeIcon icon={faStar} />
            </span>
             <span className="star" aria-hidden>
              <FontAwesomeIcon icon={faStar} />
            </span>
             <span className="star" aria-hidden>
              <FontAwesomeIcon icon={faStar} />
            </span>
             <span className="star" aria-hidden>
              <FontAwesomeIcon icon={faStar} />
            </span>
             <span className="star" aria-hidden>
              <FontAwesomeIcon icon={faStar} />
            </span>
            </div>
            
            <span className="score">{rating}</span>
            <span className="sep">{basedon}</span>
            <span className="count">{reviewText}</span>
          </div>
        </div>
      </div>
    </section>
  );
}