"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faStar,
  faUser,
  faDollarSign,
  faXmark,
  faCircleNotch,
  faTriangleExclamation,
  faClock,
  faHeadset,
  faBookOpen,
  faArrowRight,
  faLock,
  faHand,
  faCommentDots,
  faPlus,
  faTrash,
  faSave,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "../admin/dashboard.css";
import "../admin/legal-editor.css";
import AdminToolbar from "./AdminToolbar";
import AdminSidebar from "./AdminSidebar";
import PromoBar from "./PromoBar";
import { TERMS_DEFAULT_SECTIONS, PRIVACY_DEFAULT_SECTIONS } from "@/lib/legal-defaults";

type Section = {
  id: string;
  title: string;
  icon: string;
  content: string;
};

type LegalPageData = {
  id?: string;
  slug: string;
  title: string;
  sections: Section[];
};

const AVAILABLE_ICONS = [
  { label: "Book", value: "faBookOpen", icon: faBookOpen },
  { label: "Check", value: "faCheck", icon: faCheck },
  { label: "Star", value: "faStar", icon: faStar },
  { label: "User", value: "faUser", icon: faUser },
  { label: "Dollar", value: "faDollarSign", icon: faDollarSign },
  { label: "Warning", value: "faTriangleExclamation", icon: faTriangleExclamation },
  { label: "Clock", value: "faClock", icon: faClock },
  { label: "Headset", value: "faHeadset", icon: faHeadset },
  { label: "Arrow Right", value: "faArrowRight", icon: faArrowRight },
  { label: "Lock", value: "faLock", icon: faLock },
  { label: "Hand", value: "faHand", icon: faHand },
  { label: "Comment", value: "faCommentDots", icon: faCommentDots },
  { label: "X Mark", value: "faXmark", icon: faXmark },
  { label: "Circle Notch", value: "faCircleNotch", icon: faCircleNotch },
];

export default function LegalPageEditor({ slug }: { slug: string }) {
  const [data, setData] = useState<LegalPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/legal/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const jsonData = await res.json();

      if (jsonData.sections && jsonData.sections.length > 0) {
        setData(jsonData);
      } else {
        // Initialize with defaults if empty
        const defaultTitle = slug === "terms" ? "Terms of Service" : "Privacy Policy";
        const defaultSections = slug === "terms" ? TERMS_DEFAULT_SECTIONS : PRIVACY_DEFAULT_SECTIONS;
        
        setData({
          slug,
          title: defaultTitle,
          sections: defaultSections as Section[],
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch(`/api/admin/legal/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      setMessage({ type: "success", text: "Saved successfully" });
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage({ type: "error", text: "Failed to save data" });
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    if (!data) return;
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "New Section",
      icon: "faCheck",
      content: "",
    };
    setData({ ...data, sections: [...data.sections, newSection] });
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    if (!data) return;
    const newSections = [...data.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setData({ ...data, sections: newSections });
  };

  const removeSection = (index: number) => {
    if (!data) return;
    const newSections = data.sections.filter((_, i) => i !== index);
    setData({ ...data, sections: newSections });
  };

  const getIconObject = (iconName: string) => {
    return AVAILABLE_ICONS.find((i) => i.value === iconName)?.icon || faCheck;
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <PromoBar />
        <div className="admin-body">
          <AdminSidebar activePage={slug === "terms" ? "terms" : "privacy"} />
          <main className="admin-main">
             <div className="loading-container">
               <FontAwesomeIcon icon={faSpinner} spin size="2x" />
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
        <AdminSidebar activePage={slug === "terms" ? "terms" : "privacy"} />
        <main className="admin-main">
          <AdminToolbar title={slug === "terms" ? "Terms of Service" : "Privacy Policy"} />

          <div className="admin-content">
            <div className="users-hero">
               <div className="users-hero-left">
                 <h2>{slug === "terms" ? "Terms of Service" : "Privacy Policy"}</h2>
                 <p>Manage content for the {slug === "terms" ? "Terms of Service" : "Privacy Policy"} page.</p>
               </div>
               <div className="users-hero-right">
                 <button 
                   className="admin-btn-primary" 
                   onClick={handleSave}
                   disabled={saving}
                 >
                   <FontAwesomeIcon icon={saving ? faSpinner : faSave} spin={saving} />
                   {saving ? "Saving..." : "Save Changes"}
                 </button>
               </div>
            </div>

            {message && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            {data && (
              <div className="admin-card legal-page-editor">
                <div className="form-group mb-4">
                  <label>Global Page Title</label>
                  <p className="text-sm text-gray-500 mb-2">This is the main title displayed at the top of the public page (e.g. "Terms of Service").</p>
                  <input
                    type="text"
                    className="admin-input"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                  />
                </div>

                <div className="sections-list">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="heading3-terms">Content Sections</h3>
                    <button className="admin-btn-primary" onClick={addSection}>
                      <FontAwesomeIcon icon={faPlus} /> Add New Section
                    </button>
                  </div>
                  
                  {data.sections.length === 0 && (
                    <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <p className="text-gray-500 mb-4">No sections yet. Add one to get started.</p>
                      <button className="admin-btn-secondary" onClick={addSection}>
                        <FontAwesomeIcon icon={faPlus} /> Add Section
                      </button>
                    </div>
                  )}

                  {data.sections.map((section, index) => (
                    <div key={section.id} className="admin-card-sub">
                      <div className="section-header">
                        <div className="flex items-center gap-2">
                           <span className="section-number">#{index + 1}</span>
                           <h4 className="font-semibold text-lg m-0">{section.title || "Untitled Section"}</h4>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            className="btn-icon danger"
                            onClick={() => removeSection(index)}
                            title="Remove Section"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group form-col-title">
                          <label>Section Title</label>
                          <input
                            type="text"
                            className="admin-input"
                            placeholder="e.g. Interpretation and Definitions"
                            value={section.title}
                            onChange={(e) => updateSection(index, "title", e.target.value)}
                          />
                        </div>
                        <div className="form-group form-col-icon">
                          <label>Icon</label>
                          <div className="icon-select-wrapper">
                            <div className="icon-preview">
                              <FontAwesomeIcon icon={getIconObject(section.icon)} />
                            </div>
                            <select
                              className="admin-select"
                              value={section.icon}
                              onChange={(e) => updateSection(index, "icon", e.target.value)}
                            >
                              {AVAILABLE_ICONS.map((icon) => (
                                <option key={icon.value} value={icon.value}>
                                  {icon.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="flex justify-between items-center mb-1">
                          <label>Content <span className="markdown-badge">Markdown Supported</span></label>
                        </div>
                        <textarea
                          className="admin-textarea"
                          rows={12}
                          placeholder="## Subsection Title&#10;&#10;Your content goes here. You can use **bold**, *italics*, and lists."
                          value={section.content}
                          onChange={(e) => updateSection(index, "content", e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Tip: Use **bold** for emphasis, - for lists, and ## for subtitles.
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {data.sections.length > 0 && (
                     <button className="admin-btn-secondary w-full py-3 border-dashed" onClick={addSection}>
                      <FontAwesomeIcon icon={faPlus} /> Add Another Section
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
