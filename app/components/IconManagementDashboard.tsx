"use client";

import { useState, useEffect } from "react";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faHeart,
  faUser,
  faComment,
  faEye,
  faEyeSlash,
  faCircleInfo,
  faStar,
  faBookOpen,
  faBell,
  faCheckCircle,
  faFire,
  faShield,
  faAward,
  faLifeRing,
  faQuestionCircle,
  faCheck,
  faClock,
  faPaperPlane,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faPlus,
  faMinus,
  faSearch,
  faShare,
  faEnvelope,
  faLink,
  faSun,
  faMoon,
  faHome,
  faPlayCircle,
  faHeadphones,
  faThumbsUp,
  faRotate,
  faLock,
  faCreditCard,
  faBitcoinSign,
  faGauge,
  faList,
  faGear,
  faArrowRightFromBracket,
  faFilter,
  faUserCircle,
  faTag,
  faClipboardList,
  faCube,
  faChartBar,
  faDollarSign,
  faImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

type IconItem = {
  id: string;
  name: string;
  icon?: any;
  isCustom?: boolean;
  customText?: string;
  dbId?: string;
  url?: string;
  category?: string | null;
};

// Map icon names to FontAwesome icons
const iconMap: Record<string, any> = {
  HamburgerIcon: faBars,
  XIcon: faXmark,
  ChevronDownIcon: faChevronDown,
  ChevronRightIcon: faChevronRight,
  ChevronUpIcon: faChevronUp,
  HeartIcon: faHeart,
  UserIcon: faUser,
  ChatIcon: faComment,
  EyeIcon: faEye,
  EyeSlashIcon: faEyeSlash,
  InformationCircleIcon: faCircleInfo,
  StarIcon: faStar,
  BookOpenIcon: faBookOpen,
  BellIcon: faBell,
  CheckCircleIcon: faCheckCircle,
  FireIcon: faFire,
  ShieldCheckIcon: faShield,
  AwardIcon: faAward,
  LifebuoyIcon: faLifeRing,
  VerifiedIcon: faShield,
  QuestionMarkCircleIcon: faQuestionCircle,
  CheckmarkIcon: faCheck,
  ClockIcon: faClock,
  SendIcon: faPaperPlane,
  SparklesIcon: faStar,
  ArrowLeftIcon: faArrowLeft,
  ArrowRightIcon: faArrowRight,
  ArrowUpIcon: faArrowUp,
  PlusIcon: faPlus,
  MinusIcon: faMinus,
  SearchIcon: faSearch,
  ShareIcon: faShare,
  MailIcon: faEnvelope,
  LinkIcon: faLink,
  SunIcon: faSun,
  MoonIcon: faMoon,
  HomeIcon: faHome,
  PlayCircleIcon: faPlayCircle,
  HeadphoneIcon: faHeadphones,
  ThumbsUpIcon: faThumbsUp,
  RefreshIcon: faRotate,
  LockClosedIcon: faLock,
  CreditCardIcon: faCreditCard,
  CurrencyBitcoinIcon: faBitcoinSign,
  DashboardIcon: faGauge,
  OrderHistoryIcon: faList,
  SettingsIcon: faGear,
  LogoutIcon: faArrowRightFromBracket,
  FilterIcon: faFilter,
  InstagramProfileIcon: faUserCircle,
  TagIcon: faTag,
  ClipboardDocumentListIcon: faClipboardList,
  CubeIcon: faCube,
  CogIcon: faGear,
  ChartIcon: faChartBar,
  CurrencyDollarIcon: faDollarSign,
  PhotoIcon: faImage,
  FollowersIcon: faUser,
  LikesIcon: faHeart,
  ViewsIcon: faEye,
  AutomaticLikesIcon: faHeart,
  TikTokFollowersIcon: faUser,
  TikTokViewsIcon: faEye,
  YouTubeSubscribersIcon: faUser,
  YouTubeLikesIcon: faThumbsUp,
  YouTubeViewsIcon: faEye,
  RocketLaunchIcon: faFire,
  InstagramLikesShortcutIcon: faHeart,
  InstagramViewsShortcutIcon: faEye,
  InstagramFollowersShortcutIcon: faUser,
  TikTokLikesShortcutIcon: faHeart,
  TikTokFollowersShortcutIcon: faUser,
  YouTubeLikesShortcutIcon: faThumbsUp,
  YouTubeSubscribersShortcutIcon: faUser,
  YouTubeViewsShortcutIcon: faEye,
};

// Helper to convert DB icon to IconItem
const dbIconToIconItem = (dbIcon: any): IconItem => {
  const faIcon = iconMap[dbIcon.name];
  const hasUrl = dbIcon.url && dbIcon.url.trim() !== '';
  const isCustom = !faIcon || hasUrl;
  
  return {
    id: dbIcon.id,
    dbId: dbIcon.id,
    name: dbIcon.name,
    icon: faIcon,
    isCustom,
    customText: dbIcon.alt || dbIcon.name,
    url: dbIcon.url,
    category: dbIcon.category,
  };
};

export default function IconManagementDashboard() {
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIconData, setNewIconData] = useState({
    name: "",
    category: "General UI Icons",
    url: "",
    alt: "",
  });

  useEffect(() => {
    loadIcons();
  }, []);

  const loadIcons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cms/icons");
      if (!res.ok) throw new Error("Failed to load icons");
      const data = await res.json();
      const iconItems = (data.icons || []).map(dbIconToIconItem);
      setIcons(iconItems);
    } catch (err: any) {
      console.error("Icons load error", err);
      setError(err.message || "Failed to load icons");
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceClick = (dbId: string) => {
    const input = document.getElementById(`icon-file-${dbId}`) as HTMLInputElement | null;
    if (input) input.click();
  };

  const handleFileUpload = async (dbId: string, file: File) => {
    try {
      setUploading(true);
      
      // Upload file to /api/upload
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.publicUrl || uploadData.url;

      // Update icon with new URL
      const res = await fetch(`/api/cms/icons?id=${dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fileUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update icon");
      }

      await loadIcons();
    } catch (err: any) {
      console.error("Upload error", err);
      alert(err.message || "Failed to upload icon");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteIcon = async (dbId: string) => {
    if (!confirm("Are you sure you want to delete this icon?")) return;

    try {
      const res = await fetch(`/api/cms/icons?id=${dbId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete icon");
      }

      await loadIcons();
    } catch (err: any) {
      console.error("Delete error", err);
      alert(err.message || "Failed to delete icon");
    }
  };

  const handleAddIcon = async () => {
    try {
      if (!newIconData.name) {
        alert("Please enter an icon name");
        return;
      }

      const res = await fetch("/api/cms/icons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIconData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create icon");
      }

      setNewIconData({ name: "", category: "General UI Icons", url: "", alt: "" });
      setIsAddModalOpen(false);
      await loadIcons();
    } catch (err: any) {
      console.error("Create error", err);
      alert(err.message || "Failed to create icon");
    }
  };

  const renderReplaceControl = (item: IconItem) => (
    <div className="icon-controls">
      <button className="icon-replace-btn" onClick={() => handleReplaceClick(item.dbId!)}>
        Replace
      </button>
      <button className="icon-delete-btn" onClick={() => handleDeleteIcon(item.dbId!)} style={{ marginLeft: "8px", color: "red", border: "none", background: "none", cursor: "pointer" }}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <input
        id={`icon-file-${item.dbId}`}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && item.dbId) {
            handleFileUpload(item.dbId, e.target.files[0]);
          }
        }}
      />
    </div>
  );

  const renderIcon = (item: IconItem) => {
    // If has URL (image), show image
    if (item.url && item.url.trim() !== '') {
      return (
        <img
          src={item.url}
          alt={item.customText || item.name}
          className="icon-image-display"
          style={{ maxWidth: "48px", maxHeight: "48px", objectFit: "contain" }}
        />
      );
    }
    // If custom text, show text
    if (item.isCustom && item.customText) {
      return (
        <div className="icon-custom-display">
          <span>{item.customText}</span>
        </div>
      );
    }
    // Otherwise show FontAwesome icon
    if (item.icon) {
      return <FontAwesomeIcon icon={item.icon} className="icon-fa-display" />;
    }
    // Fallback
    return <div className="icon-custom-display"><span>{item.name}</span></div>;
  };

  // Group icons by category from database
  const groupedIcons = icons.reduce((acc, icon) => {
    const category = icon.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(icon);
    return acc;
  }, {} as Record<string, IconItem[]>);

  const categories = Object.keys(groupedIcons).sort();
  const existingCategories = Array.from(new Set(icons.map(i => i.category).filter(Boolean)));

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="iconManagement" />
        <main className="admin-main">
          <AdminToolbar title="Icon Management" />
          <div className="icon-management-page">
            <div className="icon-management-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1>Icon Management</h1>
                <p>View and manage SVG icons used across the site.</p>
              </div>
              <button 
                className="icon-add-header-btn"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Icon
              </button>
            </div>

            {error && (
              <div style={{ color: "#b91c1c", marginBottom: "16px", padding: "12px", backgroundColor: "#fee2e2", borderRadius: "4px" }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                Loading icons...
              </div>
            ) : icons.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>No icons found.</p>
              </div>
            ) : (
              categories.map((category) => {
                const categoryIcons = groupedIcons[category] || [];
                if (categoryIcons.length === 0) return null;
                
                return (
                  <div key={category} className="icon-section">
                    <h2 className="icon-section-title">{category}</h2>
                    <div className="icon-grid">
                      {categoryIcons.map((icon) => (
                        <div key={icon.dbId || icon.id} className="icon-card">
                          <div className="icon-display">{renderIcon(icon)}</div>
                          <div className="icon-name">{icon.name}</div>
                          {icon.dbId && renderReplaceControl(icon)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {isAddModalOpen && (
        <div className="icon-modal-overlay">
          <div className="icon-modal-content">
            <h2 className="icon-modal-title">Add New Icon</h2>
            
            <div className="icon-form-group">
              <label className="icon-form-label">Name</label>
              <input 
                className="icon-form-input"
                type="text" 
                value={newIconData.name}
                onChange={(e) => setNewIconData({...newIconData, name: e.target.value})}
                placeholder="e.g. MyNewIcon"
              />
            </div>

            <div className="icon-form-group">
              <label className="icon-form-label">Icon File (Optional)</label>
              <input 
                className="icon-form-input"
                type="file" 
                accept=".svg,.png,.jpg,.jpeg,.webp"
                disabled={uploading}
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    try {
                      setUploading(true);
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (!res.ok) throw new Error('Upload failed');
                      
                      const data = await res.json();
                      setNewIconData({...newIconData, url: data.publicUrl || data.url});
                    } catch (err) {
                      console.error(err);
                      alert('Failed to upload file');
                    } finally {
                      setUploading(false);
                    }
                  }
                }}
              />
              {newIconData.url && (
                <div style={{ marginTop: "10px" }}>
                  <p style={{ fontSize: "12px", marginBottom: "5px" }}>Preview:</p>
                  <img src={newIconData.url} alt="Preview" style={{ maxWidth: "50px", maxHeight: "50px" }} />
                </div>
              )}
            </div>

            <div className="icon-form-group">
              <label className="icon-form-label">Category</label>
              <input 
                className="icon-form-input"
                type="text" 
                value={newIconData.category}
                onChange={(e) => setNewIconData({...newIconData, category: e.target.value})}
                list="categories-list"
              />
              <datalist id="categories-list">
                {existingCategories.map((c: any) => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="icon-form-group">
              <label className="icon-form-label">Alt Text / Custom Text</label>
              <input 
                className="icon-form-input"
                type="text" 
                value={newIconData.alt}
                onChange={(e) => setNewIconData({...newIconData, alt: e.target.value})}
                placeholder="e.g. 🔥"
              />
            </div>

            <div className="icon-modal-actions">
              <button 
                className="icon-btn-secondary"
                onClick={() => setIsAddModalOpen(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button 
                className="icon-btn-primary"
                onClick={handleAddIcon}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
