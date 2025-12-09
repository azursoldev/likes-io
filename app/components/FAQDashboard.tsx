"use client";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

type FAQGroup = {
  id: number;
  title: string;
  items: FAQItem[];
};

const initialHomepageFaqs: FAQItem[] = [
  { id: 1, question: "Is buying engagement from Likes.io safe?", answer: "Yes, our services are designed with your account's safety as our top priority. We use secure, proven methods to deliver engagement that looks natural. We never ask for your password." },
  { id: 2, question: "How quickly will I receive my order?", answer: "Most orders begin processing instantly. For larger packages, we use a gradual “drip-feed” delivery to ensure the growth appears organic and safe for your account." },
  { id: 3, question: "What is the difference between High-Quality and Premium?", answer: "High-Quality services provide social proof from realistic-looking profiles; Premium services come from active users with stronger signals to the platform’s algorithm, better for boosting organic reach." },
  { id: 4, question: "Will the followers or likes I buy drop over time?", answer: "We provide high-quality, stable engagement with very low drop rates. Additionally, all our packages come with a refill guarantee to ensure your numbers remain consistent." },
];

const mainFaqGroups: FAQGroup[] = [
  {
    id: 1,
    title: "General Knowledge",
    items: [
      { id: 1, question: "What is Likes.io and how does it work?", answer: "Likes.io is a social growth service designed to increase your social proof. We provide high-quality likes, followers, and views by promoting your profile or content through our network, helping to kickstart your engagement." },
      { id: 2, question: "Is using Likes.io safe for my social media account?", answer: "Yes, our services are designed with your account's safety as a top priority. We use delivery methods that mimic organic growth patterns to minimize risk, and we never ask for your password. However, it’s important to understand that using any third-party growth service carries some inherent risk, and we are not affiliated with Meta, TikTok, or Google." },
      { id: 3, question: "What is the difference between “High-Quality” and “Premium” services?", answer: "High-quality services provide social proof from realistic-looking profiles, which is ideal for quickly establishing credibility. Premium services come from active users, which sends a stronger signal to the platform’s algorithm and is recommended for those looking to enhance their organic reach." },
      { id: 4, question: "How quickly will I receive my order?", answer: "Most orders begin processing within minutes of your payment. For smaller packages, delivery is very fast. For larger orders, we often use a gradual “drip-feed” delivery method over several hours or days to ensure the growth appears natural and safe for your account." },
    ],
  },
  {
    id: 2,
    title: "Orders & Delivery",
    items: [
      { id: 5, question: "What should I do if I haven't received my order?", answer: "First, please ensure your account was set to “public” when you placed the order, as we cannot deliver to private accounts. While most orders are delivered quickly, please allow up to 24 hours for completion, especially for larger packages. If you still have issues, contact our 24/7 support with your order ID." },
      { id: 6, question: "Can I split an order of likes or views across multiple posts?", answer: "Yes, for many of our services you can distribute an order across multiple posts. Our checkout process for Instagram and TikTok likes, for example, allows you to select several posts and assign the engagement as you see fit." },
      { id: 7, question: "Why did my follower or like count drop?", answer: "Drops are a rare occurrence with any growth service, just as they are with organic followers. To counter this, we provide a refill guarantee for a specified period with our packages. If you notice a drop within this timeframe, our system will automatically replenish it." },
    ],
  },
  {
    id: 3,
    title: "Account Safety",
    items: [
      { id: 8, question: "Do you need my password?", answer: "No, we will never ask for your password or any sensitive login credentials. All we need is your public username or the URL to your content. Any service that requests your password should be considered insecure." },
      { id: 9, question: "Can my account get banned for using your service?", answer: "While all third-party growth services carry some level of risk, we have designed our methods to be as safe as possible. By using gradual, natural-looking delivery and high-quality profiles, we significantly minimize the risk of your account being flagged." },
      { id: 10, question: "Can I use your service if my account is private?", answer: "No, your account must be set to “public” for us to deliver followers, likes, or views. You can set it back to private as soon as your order is fully delivered." },
    ],
  },
  {
    id: 4,
    title: "Billing Questions",
    items: [
      { id: 11, question: "What payment methods do you accept?", answer: "We accept all major credit and debit cards (Visa, MasterCard, American Express) and Apple Pay. All transactions are handled by a secure, PCI DSS Level 1 compliant payment processor." },
      { id: 12, question: "Is my payment information secure?", answer: "Yes, your payment information is highly secure. We use an encrypted payment gateway, and we do not store your credit card details on our servers." },
      { id: 13, question: "Do you offer refunds?", answer: "We offer a 100% money-back guarantee if we fail to deliver your order as described. If you encounter any delivery issues, please contact our support team so we can resolve the problem or process a refund." },
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
}: {
  title: string;
  items: FAQItem[];
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
  showBottomAdd?: boolean;
  onAdd?: () => void;
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
                  <button className="faq-edit-btn">
                    <span>Edit</span>
                  </button>
                  <button className="faq-delete-btn">
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
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(
    Object.fromEntries(mainFaqGroups.map((g) => [g.id, false]))
  );
  const [homeFaqs, setHomeFaqs] = useState<FAQItem[]>(initialHomepageFaqs);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const resetForm = () => {
    setNewQuestion("");
    setNewAnswer("");
    setEditingId(null);
  };

  const handleSave = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    if (editingId !== null) {
      setHomeFaqs((prev) =>
        prev.map((faq) =>
          faq.id === editingId
            ? { ...faq, question: newQuestion.trim(), answer: newAnswer.trim() }
            : faq
        )
      );
    } else {
      const next: FAQItem = {
        id: Date.now(),
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      };
      setHomeFaqs((prev) => [next, ...prev]);
    }
    resetForm();
    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    setHomeFaqs((prev) => prev.filter((faq) => faq.id !== id));
  };

  const handleStartAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleStartEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setShowAddModal(true);
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="faq" />

        <main className="admin-main">
          <AdminToolbar title="FAQ Management" />

          <div className="faq-intro">
            <h1>FAQ Management</h1>
            <p>Manage FAQs for the homepage and the main FAQ page.</p>
          </div>

      <div className="faq-home-card">
        <div className="faq-home-header">
          <h2>Homepage FAQs</h2>
          <button className="faq-add-chip" onClick={handleStartAdd}>
            <span className="faq-add-plus">+</span>
            <span>Add</span>
          </button>
        </div>
        <div className="faq-section-list">
          {homeFaqs.map((item) => (
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
          ))}
        </div>
      </div>

      <div className="faq-main-card">
        <div className="faq-section-header">
          <h2>Main FAQ Page</h2>
        </div>
        <div className="faq-section-list">
          {mainFaqGroups.map((group) => (
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
              onAdd={handleStartAdd}
            />
          ))}
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
                <textarea
                  className="faq-modal-textarea"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter answer"
                  rows={5}
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
              >
                Cancel
              </button>
              <button
                className="faq-modal-save"
                onClick={handleSave}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

