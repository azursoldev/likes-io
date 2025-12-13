"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";

type FeaturedItem = {
  id: number;
  preview: string;
  type: "text" | "image";
  content: string;
  pageLinks: string[];
};

const initialItems: FeaturedItem[] = [
  { id: 1, preview: "Forbes", type: "text", content: "Forbes", pageLinks: ["/"] },
  { id: 2, preview: "Business Insider", type: "text", content: "Business Insider", pageLinks: ["/"] },
  { id: 3, preview: "Entrepreneur", type: "text", content: "Entrepreneur", pageLinks: ["/"] },
  { id: 4, preview: "WIRED", type: "text", content: "WIRED", pageLinks: ["/"] },
];

export default function FeaturedOnDashboard() {
  const [items, setItems] = useState<FeaturedItem[]>(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [preview, setPreview] = useState("");
  const [type, setType] = useState<"text" | "image">("text");
  const [content, setContent] = useState("");
  const [pageLinks, setPageLinks] = useState<string[]>([]);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImageName, setLogoImageName] = useState("");

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const resetForm = () => {
    setPreview("");
    setType("text");
    setContent("");
    setPageLinks([]);
    setLogoImage(null);
    setLogoImageName("");
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleStartEdit = (item: FeaturedItem) => {
    setEditingId(item.id);
    setPreview(item.preview);
    setType(item.type);
    setContent(item.content);
    setPageLinks(item.pageLinks);
    setShowModal(true);
  };

  const handleSave = () => {
    if (pageLinks.length === 0) return;
    if (type === "text" && !preview.trim()) return;
    if (type === "image" && (!logoImage && !logoImageName) && !content.trim()) return;

    const finalPreview = type === "text" ? preview.trim() : logoImageName || content.trim() || "Image";
    const finalContent = type === "text" ? preview.trim() : content.trim();

    if (editingId !== null) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, preview: finalPreview, type, content: finalContent, pageLinks }
            : it
        )
      );
    } else {
      const next: FeaturedItem = {
        id: Date.now(),
        preview: finalPreview,
        type,
        content: finalContent,
        pageLinks,
      };
      setItems((prev) => [...prev, next]);
    }
    resetForm();
    setShowModal(false);
  };

  const handleAddPageLink = () => {
    setPageLinks((prev) => [...prev, ""]);
  };

  const handleUpdatePageLink = (index: number, value: string) => {
    setPageLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
  };

  const handleRemovePageLink = (index: number) => {
    setPageLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this item?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="featuredOn" />
        <main className="admin-main">
          <AdminToolbar title="Featured On" />
          <div className="featured-page">
            <div className="featured-header">
              <div>
                <h2>As Featured On</h2>
                <p>Manage the logos displayed in the 'As Featured On' section.</p>
              </div>
              <button className="featured-add-btn" onClick={handleStartAdd}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="featured-card">
              <table className="featured-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Type</th>
                    <th>Content / Alt Text</th>
                    <th>Page Links</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="featured-preview">{item.preview}</td>
                      <td>
                        <span className="type-pill">{item.type}</span>
                      </td>
                      <td>{item.content}</td>
                      <td>Linked on {item.pageLinks.length} page(s)</td>
                      <td className="actions-cell">
                        <button className="link-btn" onClick={() => handleStartEdit(item)}>
                          Edit
                        </button>
                        <button className="link-btn danger" onClick={() => handleDelete(item.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="faq-modal-backdrop">
          <div className="faq-modal featured-modal">
            <div className="faq-modal-header">
              <h3>{isEditing ? "Edit Item" : "Add New Item"}</h3>
              <button
                className="faq-modal-close"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="faq-modal-body">
              <label className="faq-modal-label">
                Type
                <div className="type-pill-group">
                  <button
                    type="button"
                    className={`type-pill-btn ${type === "text" ? "active" : ""}`}
                    onClick={() => setType("text")}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    className={`type-pill-btn ${type === "image" ? "active" : ""}`}
                    onClick={() => setType("image")}
                  >
                    Image
                  </button>
                </div>
              </label>
              {type === "text" ? (
                <label className="faq-modal-label">
                  Brand Name
                  <input
                    className="faq-modal-input featured-dark-input"
                    value={preview}
                    onChange={(e) => setPreview(e.target.value)}
                    placeholder="e.g., Forbes"
                  />
                </label>
              ) : (
                <>
                  <label className="faq-modal-label">
                    Logo Image
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <label
                        htmlFor="logo-upload"
                        style={{
                          padding: "8px 16px",
                          background: "#f97316",
                          color: "#fff",
                          border: "1px solid #f97316",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Choose File
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoImage(file);
                            setLogoImageName(file.name);
                          }
                        }}
                      />
                      <input
                        type="text"
                        readOnly
                        value={logoImageName || "No file chosen"}
                        className="faq-modal-input featured-dark-input"
                        style={{ flex: 1, cursor: "default" }}
                      />
                    </div>
                  </label>
                  <label className="faq-modal-label">
                    Alt Text
                    <input
                      className="faq-modal-input featured-dark-input"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="e.g., Forbes Logo"
                    />
                  </label>
                </>
              )}
              <div className="faq-modal-label">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#374151" }}>Page Links</span>
                </div>
                {pageLinks.map((link, index) => (
                  <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      className="faq-modal-input featured-dark-input"
                      value={link}
                      onChange={(e) => handleUpdatePageLink(index, e.target.value)}
                      placeholder="e.g., /home"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePageLink(index)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "0 8px",
                        fontSize: "14px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPageLink}
                  className="add-link-btn"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                    padding: "8px 0",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: "12px" }} />
                  <span>Add Link</span>
                </button>
              </div>
            </div>
            <div className="faq-modal-footer">
              <button
                className="faq-modal-cancel"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="faq-modal-save"
                onClick={handleSave}
                disabled={
                  pageLinks.length === 0 ||
                  (type === "text" ? !preview.trim() : (!logoImage && !logoImageName) || !content.trim())
                }
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

