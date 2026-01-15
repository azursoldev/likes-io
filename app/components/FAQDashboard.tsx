"use client";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  category?: string | null;
  displayOrder?: number;
};

type FAQGroup = {
  id: number;
  title: string;
  items: FAQItem[];
};

// Default data to seed
const DEFAULT_HOMEPAGE_FAQS: Omit<FAQItem, "id">[] = [
  { question: "Is buying engagement from Likes.io safe?", answer: "Yes, our services are designed with your account's safety as our top priority. We use secure, proven methods to deliver engagement that looks natural. We never ask for your password.", category: "homepage", displayOrder: 0 },
  { question: "How quickly will I receive my order?", answer: "Most orders begin processing instantly. For larger packages, we use a gradual \"drip-feed\" delivery to ensure the growth appears organic and safe for your account.", category: "homepage", displayOrder: 1 },
  { question: "What is the difference between High-Quality and Premium?", answer: "High-Quality services provide social proof from realistic-looking profiles; Premium services come from active users with stronger signals to the platform's algorithm, better for boosting organic reach.", category: "homepage", displayOrder: 2 },
  { question: "Will the followers or likes I buy drop over time?", answer: "We provide high-quality, stable engagement with very low drop rates. Additionally, all our packages come with a refill guarantee to ensure your numbers remain consistent.", category: "homepage", displayOrder: 3 },
];

const DEFAULT_MAIN_FAQ_GROUPS: { title: string; items: Omit<FAQItem, "id">[] }[] = [
  {
    title: "General Knowledge",
    items: [
      { question: "What is Likes.io and how does it work?", answer: "Likes.io is a social growth service designed to increase your social proof. We provide high-quality likes, followers, and views by promoting your profile or content through our network, helping to kickstart your engagement.", category: "General Knowledge", displayOrder: 0 },
      { question: "Is using Likes.io safe for my social media account?", answer: "Yes, our services are designed with your account's safety as a top priority. We use delivery methods that mimic organic growth patterns to minimize risk, and we never ask for your password. However, it's important to understand that using any third-party growth service carries some inherent risk, and we are not affiliated with Meta, TikTok, or Google.", category: "General Knowledge", displayOrder: 1 },
      { question: "What is the difference between \"High-Quality\" and \"Premium\" services?", answer: "High-quality services provide social proof from realistic-looking profiles, which is ideal for quickly establishing credibility. Premium services come from active users, which sends a stronger signal to the platform's algorithm and is recommended for those looking to enhance their organic reach.", category: "General Knowledge", displayOrder: 2 },
      { question: "How quickly will I receive my order?", answer: "Most orders begin processing within minutes of your payment. For smaller packages, delivery is very fast. For larger orders, we often use a gradual \"drip-feed\" delivery method over several hours or days to ensure the growth appears natural and safe for your account.", category: "General Knowledge", displayOrder: 3 },
    ],
  },
  {
    title: "Orders & Delivery",
    items: [
      { question: "What should I do if I haven't received my order?", answer: "First, please ensure your account was set to \"public\" when you placed the order, as we cannot deliver to private accounts. While most orders are delivered quickly, please allow up to 24 hours for completion, especially for larger packages. If you still have issues, contact our 24/7 support with your order ID.", category: "Orders & Delivery", displayOrder: 0 },
      { question: "Can I split an order of likes or views across multiple posts?", answer: "Yes, for many of our services you can distribute an order across multiple posts. Our checkout process for Instagram and TikTok likes, for example, allows you to select several posts and assign the engagement as you see fit.", category: "Orders & Delivery", displayOrder: 1 },
      { question: "Why did my follower or like count drop?", answer: "Drops are a rare occurrence with any growth service, just as they are with organic followers. To counter this, we provide a refill guarantee for a specified period with our packages. If you notice a drop within this timeframe, our system will automatically replenish it.", category: "Orders & Delivery", displayOrder: 2 },
    ],
  },
  {
    title: "Account Safety",
    items: [
      { question: "Do you need my password?", answer: "No, we will never ask for your password or any sensitive login credentials. All we need is your public username or the URL to your content. Any service that requests your password should be considered insecure.", category: "Account Safety", displayOrder: 0 },
      { question: "Can my account get banned for using your service?", answer: "While all third-party growth services carry some level of risk, we have designed our methods to be as safe as possible. By using gradual, natural-looking delivery and high-quality profiles, we significantly minimize the risk of your account being flagged.", category: "Account Safety", displayOrder: 1 },
      { question: "Can I use your service if my account is private?", answer: "No, your account must be set to \"public\" for us to deliver followers, likes, or views. You can set it back to private as soon as your order is fully delivered.", category: "Account Safety", displayOrder: 2 },
    ],
  },
  {
    title: "Billing Questions",
    items: [
      { question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards (Visa, MasterCard, American Express) and Apple Pay. All transactions are handled by a secure, PCI DSS Level 1 compliant payment processor.", category: "Billing Questions", displayOrder: 0 },
      { question: "Is my payment information secure?", answer: "Yes, your payment information is highly secure. We use an encrypted payment gateway, and we do not store your credit card details on our servers.", category: "Billing Questions", displayOrder: 1 },
      { question: "Do you offer refunds?", answer: "We offer a 100% money-back guarantee if we fail to deliver your order as described. If you encounter any delivery issues, please contact our support team so we can resolve the problem or process a refund.", category: "Billing Questions", displayOrder: 2 },
    ],
  },
];

function FAQSection({
  title,
  items,
  collapsible = false,
  open = true,
  onToggle,
  showBottomAdd = false,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  items: FAQItem[];
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
  showBottomAdd?: boolean;
  onAdd?: () => void;
  onEdit?: (item: FAQItem) => void;
  onDelete?: (id: number) => void;
}) {
  return (
    <div className={`faq-card ${collapsible && !open ? "collapsed" : ""}`}>
      <button className="faq-card-header" onClick={collapsible ? onToggle : undefined} aria-label="Toggle FAQ section">
        <div className="faq-card-header-left">
          <h3>{title}</h3>
        </div>
        {collapsible && (
          <div className="faq-card-arrow">
            <span className={`faq-collapse-btn ${open ? "open" : ""}`}>
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </div>
        )}
      </button>
      {(!collapsible || open) && (
        <>
          <div className="faq-table">
            {items.map((item) => (
              <div className="faq-row" key={item.id}>
                <div className="faq-question-answer">
                  <div className="faq-question">{item.question}</div>
                  <div className="faq-answer">{item.answer}</div>
                </div>
                <div className="faq-row-actions">
                  <button className="faq-edit-btn" onClick={() => onEdit?.(item)}>
                    <span>Edit</span>
                  </button>
                  <button className="faq-delete-btn" onClick={() => onDelete?.(item.id)}>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {showBottomAdd && (
            <div className="faq-bottom-add">
              <button className="faq-add-link" onClick={onAdd}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Question</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function FAQDashboard() {
  const [loading, setLoading] = useState(true);
  const [homeFaqs, setHomeFaqs] = useState<FAQItem[]>([]);
  const [mainFaqGroups, setMainFaqGroups] = useState<FAQGroup[]>([]);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const quillEditorRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<any>(null);

  // Fetch FAQs from API
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
        const faqs = data.faqs || [];
        
        // Separate homepage FAQs and main FAQs by category
        const homepageFaqs = faqs
          .filter((faq: any) => faq.category === "homepage")
          .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .map((faq: any) => ({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            displayOrder: faq.displayOrder,
          }));

        // Group main FAQs by category
        const mainFaqs = faqs.filter((faq: any) => faq.category && faq.category !== "homepage");
        const grouped = mainFaqs.reduce((acc: Record<string, FAQItem[]>, faq: any) => {
          const category = faq.category || "Other";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            displayOrder: faq.displayOrder,
          });
          return acc;
        }, {});

        // Sort items within each group by displayOrder
        Object.keys(grouped).forEach(category => {
          grouped[category].sort((a: FAQItem, b: FAQItem) => (a.displayOrder || 0) - (b.displayOrder || 0));
        });

        // Convert to FAQGroup format
        const groups: FAQGroup[] = Object.keys(grouped).map((category, index) => ({
          id: index + 1,
          title: category,
          items: grouped[category],
        }));

        setHomeFaqs(homepageFaqs);
        setMainFaqGroups(groups);
        
        // Initialize openGroups state
        setOpenGroups(Object.fromEntries(groups.map((g) => [g.id, false])));

        // Auto-seed if database is empty
        if (faqs.length === 0) {
          await seedDefaultFAQs();
        }
      } else {
        console.error("Failed to fetch FAQs");
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showAddModal) {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.off("text-change");
        quillInstanceRef.current = null;
      }
      return;
    }
    if (!quillEditorRef.current) return;
    const loadQuill = async () => {
      if (typeof window === "undefined") return;
      const w = window as any;
      if (!w.Quill) {
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.getElementById("quill-cdn-script");
          if (existingScript) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.id = "quill-cdn-script";
          script.src = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Quill"));
          document.body.appendChild(script);
        });
        const existingLink = document.getElementById("quill-snow-style");
        if (!existingLink) {
          const link = document.createElement("link");
          link.id = "quill-snow-style";
          link.rel = "stylesheet";
          link.href = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css";
          document.head.appendChild(link);
        }
      }
      if (!quillEditorRef.current) return;
      const QuillCtor = (window as any).Quill;
      if (!QuillCtor) return;
      if (quillInstanceRef.current) {
        quillInstanceRef.current.root.innerHTML = newAnswer || "";
        return;
      }
      const quill = new QuillCtor(quillEditorRef.current, {
        theme: "snow",
      });
      quill.root.innerHTML = newAnswer || "";
      quill.on("text-change", () => {
        setNewAnswer(quill.root.innerHTML);
      });
      quillInstanceRef.current = quill;
    };
    loadQuill().catch((error) => {
      console.error("Failed to initialize Quill editor:", error);
    });
  }, [showAddModal]);

  // Seed default FAQs
  const seedDefaultFAQs = async () => {
    try {
      setSaving(true);
      
      // Seed homepage FAQs
      for (const faq of DEFAULT_HOMEPAGE_FAQS) {
        await fetch("/api/cms/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faq),
        });
      }

      // Seed main FAQ groups
      for (const group of DEFAULT_MAIN_FAQ_GROUPS) {
        for (const faq of group.items) {
          await fetch("/api/cms/faq", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(faq),
          });
        }
      }

      // Refetch after seeding
      await fetchFAQs();
    } catch (error) {
      console.error("Error seeding default FAQs:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setNewQuestion("");
    setNewAnswer("");
    setNewCategory("");
    setEditingCategory("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    try {
      setSaving(true);
      const faqData: any = {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        category: newCategory || null,
        displayOrder: 0,
        isActive: true,
      };

      if (editingId !== null) {
        // Update existing FAQ
        const response = await fetch("/api/cms/faq", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...faqData }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update FAQ");
        }
      } else {
        // Create new FAQ
        const response = await fetch("/api/cms/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create FAQ");
        }
      }

      resetForm();
      setShowAddModal(false);
      await fetchFAQs();
    } catch (error: any) {
      console.error("Error saving FAQ:", error);
      alert(error.message || "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;

    try {
      const response = await fetch(`/api/cms/faq?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete FAQ");
      }

      await fetchFAQs();
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      alert(error.message || "Failed to delete FAQ");
    }
  };

  const handleStartAdd = (category?: string) => {
    resetForm();
    if (category) {
      setNewCategory(category);
    }
    setShowAddModal(true);
  };

  const handleStartEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setNewQuestion(faq.question);
    const quillUrl = "";
    const baseAnswer = faq.answer || "";
    const answerWithDocs = baseAnswer.includes(quillUrl)
      ? baseAnswer
      : baseAnswer
      ? `${baseAnswer}\n${quillUrl}`
      : quillUrl;
    setNewAnswer(answerWithDocs);
    setEditingCategory(faq.category || "");
    setNewCategory(faq.category || "");
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <PromoBar />
        <div className="admin-body">
          <AdminSidebar activePage="faq" />
          <main className="admin-main">
            <AdminToolbar title="FAQ Management" />
            <div className="admin-content">
              <div style={{ padding: "24px", textAlign: "center" }}>Loading...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="faq" />

        <main className="admin-main">
          <AdminToolbar title="FAQ Management" />
        <div className="admin-content">
          <div className="faq-intro">
            <h1>FAQ Management</h1>
            <p>Manage FAQs for the homepage and the main FAQ page.</p>
            {homeFaqs.length === 0 && mainFaqGroups.length === 0 && (
              <p style={{ marginTop: "8px", color: "#6b7280", fontSize: "14px" }}>
                No FAQs found.{" "}
                <button
                  onClick={seedDefaultFAQs}
                  disabled={saving}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "14px",
                  }}
                >
                  {saving ? "Seeding..." : "Load default FAQs"}
                </button>
              </p>
            )}
          </div>
          <div className="faq-home-card">
            <div className="faq-home-header">
              <h2>Homepage FAQs</h2>
              <button className="faq-add-chip" onClick={() => handleStartAdd("homepage")}>
                <span className="faq-add-plus">+</span>
                <span>Add</span>
              </button>
            </div>
            <div className="faq-section-list">
              {homeFaqs.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                  No homepage FAQs yet. Click "Add" to get started.
                </div>
              ) : (
                homeFaqs.map((item) => (
                  <div className="faq-row" key={`home-${item.id}`}>
                    <div className="faq-question-answer">
                      <div className="faq-question">{item.question}</div>
                      <div className="faq-answer">{item.answer}</div>
                    </div>
                    <div className="faq-row-actions">
                      <button className="faq-edit-btn" onClick={() => handleStartEdit(item)}>
                        <span>Edit</span>
                      </button>
                      <button className="faq-delete-btn" onClick={() => handleDelete(item.id)}>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="faq-main-card">
            <div className="faq-section-header">
              <h2>Main FAQ Page</h2>
            </div>
            <div className="faq-section-list">
              {mainFaqGroups.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                  No FAQ groups yet. FAQs will be grouped by category.
                </div>
              ) : (
                mainFaqGroups.map((group) => (
                  <FAQSection
                    key={group.id}
                    title={group.title}
                    items={group.items}
                    collapsible
                    open={openGroups[group.id]}
                    onToggle={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [group.id]: !prev[group.id],
                      }))
                    }
                    showBottomAdd
                    onAdd={() => handleStartAdd(group.title)}
                    onEdit={handleStartEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        </main>
      </div>

      {showAddModal && (
        <div className="faq-modal-backdrop">
          <div className="faq-modal">
            <div className="faq-modal-header">
              <h3>{editingId !== null ? "Edit FAQ" : "Add FAQ"}</h3>
              <button
                className="faq-modal-close"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="faq-modal-body">
              <label className="faq-modal-label">
                Category
                <select
                  className="faq-modal-input"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="">Select category...</option>
                  <option value="homepage">Homepage</option>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Orders & Delivery">Orders & Delivery</option>
                  <option value="Account Safety">Account Safety</option>
                  <option value="Billing Questions">Billing Questions</option>
                </select>
                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                  Leave empty for uncategorized FAQs
                </p>
              </label>
              <label className="faq-modal-label">
                Question
                <input
                  className="faq-modal-input"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter question"
                />
              </label>
              <label className="faq-modal-label">
                Answer
                <div
                  className="faq-modal-textarea"
                  ref={quillEditorRef}
                  style={{ minHeight: "200px" }}
                />
              </label>
            </div>
            <div className="faq-modal-footer">
              <button
                className="faq-modal-cancel"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="faq-modal-save"
                onClick={handleSave}
                disabled={saving || !newQuestion.trim() || !newAnswer.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
