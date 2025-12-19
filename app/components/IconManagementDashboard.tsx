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
} from "@fortawesome/free-solid-svg-icons";

type IconItem = {
  id: number;
  name: string;
  icon?: any;
  isCustom?: boolean;
  customText?: string;
  dbId?: number;
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
  const [error, setError] = useState<string | null>(null);

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

  const handleReplaceClick = (dbId: number) => {
    const input = document.getElementById(`icon-file-${dbId}`) as HTMLInputElement | null;
    if (input) input.click();
  };

  const handleFileUpload = async (dbId: number, file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const dataUrl = base64;

        const res = await fetch(`/api/cms/icons?id=${dbId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: dataUrl }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to update icon");
        }

        await loadIcons();
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error("Upload error", err);
      alert(err.message || "Failed to upload icon");
    }
  };

  const renderReplaceControl = (item: IconItem) => (
    <>
      <button className="icon-replace-btn" onClick={() => handleReplaceClick(item.dbId!)}>
        Replace
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
    </>
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

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="iconManagement" />
        <main className="admin-main">
          <AdminToolbar title="Icon Management" />
          <div className="icon-management-page">
            <div className="icon-management-header">
              <h1>Icon Management</h1>
              <p>View and manage SVG icons used across the site.</p>
            </div>

            {error && (
              <div style={{ color: "#b91c1c", marginBottom: "16px", padding: "12px" }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                Loading icons...
              </div>
            ) : icons.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p>No icons found. Run the seed script to add default icons:</p>
                <code style={{ background: "#f3f4f6", padding: "8px", borderRadius: "4px" }}>
                  node scripts/seed-icons.js
                </code>
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
    </div>
  );
}

