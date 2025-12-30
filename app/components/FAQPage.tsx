"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

type FAQCategory = {
  id: string;
  label: string;
};

type FAQItem = {
  id: number;
  category: string | null;
  question: string;
  answer: string;
};

const categoryMapping: Record<string, string> = {
  "General Knowledge": "general",
  "Orders & Delivery": "orders",
  "Account Safety": "safety",
  "Billing Questions": "billing",
};

const reverseCategoryMapping: Record<string, string> = {
  "general": "General Knowledge",
  "orders": "Orders & Delivery",
  "safety": "Account Safety",
  "billing": "Billing Questions",
};

const categories: FAQCategory[] = [
  { id: "general", label: "General Knowledge" },
  { id: "orders", label: "Orders & Delivery" },
  { id: "safety", label: "Account Safety" },
  { id: "billing", label: "Billing Questions" },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cms/faq?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        // Filter out homepage FAQs and get only main FAQ page FAQs
        const mainFaqs = (data.faqs || [])
          .filter((faq: any) => faq.category && faq.category !== "homepage")
          .map((faq: any) => ({
            id: faq.id,
            category: faq.category,
            question: faq.question,
            answer: faq.answer,
          }));
        setFaqs(mainFaqs);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Map category names to IDs for filtering
  const getCategoryId = (category: string | null): string => {
    if (!category) return "general";
    return categoryMapping[category] || "general";
  };

  const filteredFAQs = faqs.filter((faq) => {
    const categoryId = getCategoryId(faq.category);
    return categoryId === activeCategory;
  });

  const toggleQuestion = (id: number) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  // Get unique categories from fetched FAQs
  const availableCategories = categories.filter((cat) => {
    return faqs.some((faq) => {
      const categoryId = getCategoryId(faq.category);
      return categoryId === cat.id;
    });
  });

  // Set first available category as active if current one has no FAQs
  useEffect(() => {
    if (!loading && filteredFAQs.length === 0 && availableCategories.length > 0) {
      setActiveCategory(availableCategories[0].id);
    }
  }, [loading, filteredFAQs.length, availableCategories]);

  if (loading) {
    return (
      <section className="faq-page">
        <div className="container">
          <div className="faq-page-header">
            <h1 className="faq-page-title">
              Frequently Asked Questions <span className="faq-emoji">👋</span>
            </h1>
          </div>
          <div style={{ padding: "48px", textAlign: "center", color: "#6b7280" }}>
            Loading FAQs...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="faq-page">
      <div className="container">
        <div className="faq-page-header">
          <h1 className="faq-page-title">
            Frequently Asked Questions <span className="faq-emoji">👋</span>
          </h1>
        </div>

        <div className="faq-page-content">
          <aside className="faq-sidebar">
            <nav className="faq-categories">
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`faq-category-btn ${activeCategory === category.id ? "active" : ""}`}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenQuestion(null);
                    }}
                    type="button"
                  >
                    {category.label}
                    {activeCategory === category.id && (
                      <FontAwesomeIcon icon={faAngleRight} className="faq-category-arrow" />
                    )}
                  </button>
                ))
              ) : (
                <div style={{ padding: "16px", color: "#6b7280", fontSize: "14px" }}>
                  No FAQ categories available.
                </div>
              )}
            </nav>
          </aside>

          <div className="faq-questions">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className={`faq-question-item ${openQuestion === faq.id ? "open" : ""}`}
                >
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleQuestion(faq.id)}
                    type="button"
                    aria-expanded={openQuestion === faq.id}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-question-toggle">
                      {openQuestion === faq.id ? "−" : "+"}
                    </span>
                  </button>
                  {openQuestion === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: "48px", textAlign: "center", color: "#6b7280" }}>
                No FAQs available in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
