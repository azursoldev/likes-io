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
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import "../admin/dashboard.css";
import "../admin/legal-editor.css";
import AdminToolbar from "./AdminToolbar";
import AdminSidebar from "./AdminSidebar";
import PromoBar from "./PromoBar";
import { TERMS_DEFAULT_SECTIONS, PRIVACY_DEFAULT_SECTIONS } from "@/lib/legal-defaults";
import { iconMap } from "./IconMap";

type Section = {
  id: string;
  title: string;
  icon: string;
  content: string;
};

type IconItem = {
  id: string;
  name: string;
  url?: string;
  category?: string;
  alt?: string;
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
    fetchIcons();
  }, [slug]);

  const [availableIcons, setAvailableIcons] = useState<IconItem[]>([]);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(null);

  const fetchIcons = async () => {
    try {
      const res = await fetch("/api/cms/icons");
      if (res.ok) {
        const data = await res.json();
        setAvailableIcons(data.icons || []);
      }
    } catch (err) {
      console.error("Failed to fetch icons:", err);
    }
  };

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

  const handleOpenIconSelector = (index: number) => {
    setCurrentSectionIndex(index);
    setIsIconSelectorOpen(true);
  };

  const handleSelectIcon = (icon: IconItem) => {
    if (currentSectionIndex !== null && data) {
      const iconValue = icon.url || icon.name;
      updateSection(currentSectionIndex, "icon", iconValue);
      setIsIconSelectorOpen(false);
      setCurrentSectionIndex(null);
    }
  };

  const getIconObject = (iconName: string) => {
    if (iconMap[iconName]) return iconMap[iconName];
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
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{
                                width: '42px', height: '42px',
                                border: '1px solid #e5e7eb', borderRadius: '6px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#f9fafb', overflow: 'hidden'
                            }}>
                              {(section.icon && (section.icon.startsWith('/') || section.icon.startsWith('http'))) ? (
                                <img src={section.icon} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                              ) : (
                                <FontAwesomeIcon icon={getIconObject(section.icon)} style={{ fontSize: '18px', color: '#4b5563' }} />
                              )}
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleOpenIconSelector(index)}
                              style={{
                                flex: 1,
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '0 12px', height: '42px',
                                border: '1px solid #d1d5db', borderRadius: '6px',
                                background: '#fff', cursor: 'pointer', textAlign: 'left',
                                transition: 'border-color 0.15s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                            >
                              <FontAwesomeIcon icon={faImages} style={{ color: '#6b7280' }} />
                              <span style={{ color: '#374151', fontSize: '14px' }}>Select from Library</span>
                            </button>
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
      
      {isIconSelectorOpen && (
        <div className="icon-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div className="icon-modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '80%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Select Icon</h2>
              <button onClick={() => setIsIconSelectorOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', overflowY: 'auto', padding: '1rem' }}>
              {availableIcons.map((icon) => (
                <div 
                  key={icon.id} 
                  onClick={() => handleSelectIcon(icon)}
                  style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '1rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    background: '#fff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {icon.url ? (
                      <img src={icon.url} alt={icon.alt || icon.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                       iconMap[icon.name] ? <FontAwesomeIcon icon={iconMap[icon.name]} style={{ fontSize: '24px' }} /> : <span>?</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', textAlign: 'center', wordBreak: 'break-word' }}>{icon.name}</span>
                </div>
              ))}
              
              {availableIcons.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                      No icons found. Please upload icons in the Icon Management page.
                  </div>
              )}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsIconSelectorOpen(false)}
                style={{ padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
