"use client";
import { useMemo, useState, useEffect } from "react";

export type FAQItem = { q: string; a: string };

type FAQSectionProps = {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  pageSize?: number;
  category?: string; // Optional: fetch FAQs by category (e.g., "homepage")
};

export default function FAQSection({
  faqs: propFaqs,
  title = "Frequently Asked Questions",
  subtitle = "Have questions? We've got answers. If you don't see your question here, feel free to contact us.",
  pageSize = 7,
  category,
}: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>(propFaqs || []);
  const [loading, setLoading] = useState(!propFaqs);

  // Fetch FAQs from API if category is provided or if no faqs prop is provided
  useEffect(() => {
    if (propFaqs) {
      setFaqs(propFaqs);
      setLoading(false);
      return;
    }

    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const url = category 
          ? `/api/cms/faq?category=${encodeURIComponent(category)}`
          : "/api/cms/faq";
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const fetchedFaqs = (data.faqs || []).map((faq: any) => ({
            q: faq.question,
            a: faq.answer,
          }));
          if (fetchedFaqs.length > 0) {
            setFaqs(fetchedFaqs);
          }
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [category, propFaqs]);
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

  if (loading) {
    return (
      <section className="faq-section">
        <div className="container">
          <div className="faq-header">
            <div className="shimmer-bg" style={{ width: '200px', height: '36px', borderRadius: '8px', margin: '0 auto 1rem auto' }}></div>
            <div className="shimmer-bg" style={{ width: '400px', height: '24px', borderRadius: '4px', margin: '0 auto' }}></div>
          </div>
          <div className="faq-list">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="faq-item" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
                 <div className="shimmer-bg" style={{ width: '80%', height: '24px', borderRadius: '4px' }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="faq-section">
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
                    <div dangerouslySetInnerHTML={{ __html: item.a }} />
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
