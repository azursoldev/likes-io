"use client";
import { useMemo, useState } from "react";

export type FAQItem = { q: string; a: string };

type FAQSectionProps = {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  pageSize?: number;
};

const DEFAULT_FAQS: FAQItem[] = [
  {
    q: "Is it safe to buy Instagram likes for my account?",
    a: "Yes. We use safe delivery methods and quality profiles that comply with platform guidelines to minimize risk and maintain account health.",
  },
  {
    q: "How quickly will I get the likes after my purchase?",
    a: "Most orders begin within minutes of purchase and complete based on your selected package size and pacing preferences.",
  },
  {
    q: "Will buying likes help my post get on the Instagram Explore Page?",
    a: "Buying likes can improve engagement signals that influence reach. High-quality content and consistent activity are also important to appear on Explore.",
  },
  {
    q: "Can I split the likes I buy across multiple Instagram posts?",
    a: "Yes, you can distribute likes across multiple posts depending on your package. During checkout you can specify the posts to boost.",
  },
  {
    q: "Does buying likes for an Instagram Reel also add views?",
    a: "Likes and views are separate metrics. You can purchase likes for Reels; if you also want views, consider a combined package for best results.",
  },
  {
    q: "What is the difference between High-Quality and Premium likes?",
    a: "Premium offers the highest authenticity and retention, ideal for brands seeking top-tier credibility. High-Quality is a cost-effective option with great results.",
  },
  {
    q: "Do I need to provide my password?",
    a: "Never. We will never ask for your password. We only need your username and the post link(s) to deliver engagement.",
  },
  { q: "Can I cancel or change my order after purchase?", a: "Contact support immediately. If delivery hasn't started, we can adjust or cancel." },
  { q: "Are likes permanent?", a: "Minor fluctuations can occur. Premium packages include better retention and stability." },
  { q: "Which payment methods do you accept?", a: "We accept major cards and secure payment options shown at checkout." },
  { q: "Do you offer refunds?", a: "Refunds are handled per our policy. If we fail to deliver as promised, we will make it right." },
  { q: "Can I buy likes for private accounts?", a: "Delivery requires the post to be publicly viewable. Make your account public during delivery." },
];

export default function FAQSection({
  faqs = DEFAULT_FAQS,
  title = "Frequently Asked Questions",
  subtitle = "Have questions? We've got answers. If you don't see your question here, feel free to contact us.",
  pageSize = 7,
}: FAQSectionProps) {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<number | null>(null); // absolute index within faqs

  const pageCount = Math.max(1, Math.ceil(faqs.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = useMemo(() => faqs.slice(start, end), [faqs, start, end]);

  const toggle = (absoluteIndex: number) => setOpen((cur) => (cur === absoluteIndex ? null : absoluteIndex));

  const goTo = (p: number) => {
    const next = Math.min(Math.max(1, p), pageCount);
    setPage(next);
    setOpen(null);
  };

  return (
    <section className="faq">
      <div className="container">
        <h2 className="faq-title">{title}</h2>
        <p className="faq-sub">{subtitle}</p>

        <div className="faq-list">
          {items.map((item, idx) => {
            const absoluteIndex = start + idx;
            const isOpen = open === absoluteIndex;
            return (
              <article key={absoluteIndex} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button className="faq-head" onClick={() => toggle(absoluteIndex)} aria-expanded={isOpen}>
                  <span className="faq-q">{item.q}</span>
                  <span className="faq-toggle">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="faq-body">
                    <p>{item.a}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="faq-pagination" aria-label="FAQ pagination">
          <button className="pager-btn" onClick={() => goTo(page - 1)} disabled={page === 1}>
            Prev
          </button>
          {Array.from({ length: pageCount }).map((_, i) => {
            const num = i + 1;
            const active = num === page;
            return (
              <button
                key={num}
                className={`pager-btn pager-num ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => goTo(num)}
              >
                {num}
              </button>
            );
          })}
          <button className="pager-btn" onClick={() => goTo(page + 1)} disabled={page === pageCount}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
