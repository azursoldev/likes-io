"use client";
import { useState } from "react";

type FAQ = { q: string; a: string };

const FAQS: FAQ[] = [
  {
    q: "Is buying engagement from Likes.io safe?",
    a: "Yes. We use safe delivery methods and quality profiles that comply with platform guidelines to minimize risk and maintain account health.",
  },
  {
    q: "How quickly will I receive my order?",
    a: "Most orders begin within minutes of purchase and complete based on the selected package size and pacing preferences.",
  },
  {
    q: "What is the difference between High-Quality and Premium?",
    a: "Premium offers the highest authenticity and retention, ideal for brands seeking top-tier credibility. High-Quality is a cost-effective option with great results.",
  },
  {
    q: "Will the followers or likes I buy drop over time?",
    a: "Minor fluctuations are normal. Premium packages include better retention. If you experience unexpected drops, our support team will assist promptly.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (idx: number) => setOpen((cur) => (cur === idx ? null : idx));

  return (
    <section className="faq">
      <div className="container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-sub">
          Have questions? We've got answers. If you don't see your question here, feel free to contact us.
        </p>

        <div className="faq-list">
          {FAQS.map((item, idx) => (
            <article key={idx} className={`faq-item ${open === idx ? "open" : ""}`}> 
              <button
                className="faq-head"
                onClick={() => toggle(idx)}
                aria-expanded={open === idx}
              >
                <span className="faq-q">{item.q}</span>
                <span className="faq-toggle">{open === idx ? "−" : "+"}</span>
              </button>
              {open === idx && (
                <div className="faq-body">
                  <p>{item.a}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}