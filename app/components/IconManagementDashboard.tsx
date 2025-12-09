"use client";

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
  faStar,
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
};

const logos: IconItem[] = [
  { id: 1, name: "LikesLogo", isCustom: true, customText: "Likes" },
  { id: 2, name: "LikesInCheckoutLogo", isCustom: true, customText: "Likes" },
  { id: 3, name: "Buzzoid", isCustom: true, customText: "Buzzoid.svg" },
];

const generalIcons: IconItem[] = [
  { id: 1, name: "HamburgerIcon", icon: faBars },
  { id: 2, name: "XIcon", icon: faXmark },
  { id: 3, name: "ChevronDownIcon", icon: faChevronDown },
  { id: 4, name: "ChevronRightIcon", icon: faChevronRight },
  { id: 5, name: "ChevronUpIcon", icon: faChevronUp },
  { id: 6, name: "HeartIcon", icon: faHeart },
  { id: 7, name: "UserIcon", icon: faUser },
  { id: 8, name: "ChatIcon", icon: faComment },
  { id: 9, name: "EyeIcon", icon: faEye },
  { id: 10, name: "EyeSlashIcon", icon: faEyeSlash },
  { id: 11, name: "InformationCircleIcon", icon: faCircleInfo },
  { id: 12, name: "StarIcon", icon: faStar },
  { id: 13, name: "BookOpenIcon", icon: faBookOpen },
  { id: 14, name: "BellIcon", icon: faBell },
  { id: 15, name: "CheckCircleIcon", icon: faCheckCircle },
  { id: 16, name: "FireIcon", icon: faFire },
  { id: 17, name: "ShieldCheckIcon", icon: faShield },
  { id: 18, name: "AwardIcon", icon: faAward },
  { id: 19, name: "LifebuoyIcon", icon: faLifeRing },
  { id: 20, name: "VerifiedIcon", icon: faShield },
  { id: 21, name: "QuestionMarkCircleIcon", icon: faQuestionCircle },
  { id: 22, name: "CheckmarkIcon", icon: faCheck },
  { id: 23, name: "ClockIcon", icon: faClock },
  { id: 24, name: "SendIcon", icon: faPaperPlane },
  { id: 25, name: "SparklesIcon", icon: faStar },
  { id: 26, name: "ArrowLeftIcon", icon: faArrowLeft },
  { id: 27, name: "ArrowRightIcon", icon: faArrowRight },
  { id: 28, name: "ArrowUpIcon", icon: faArrowUp },
  { id: 29, name: "PlusIcon", icon: faPlus },
  { id: 30, name: "MinusIcon", icon: faMinus },
  { id: 31, name: "SearchIcon", icon: faSearch },
  { id: 32, name: "ShareIcon", icon: faShare },
  { id: 33, name: "MailIcon", icon: faEnvelope },
  { id: 34, name: "LinkIcon", icon: faLink },
  { id: 35, name: "SunIcon", icon: faSun },
  { id: 36, name: "MoonIcon", icon: faMoon },
  { id: 37, name: "HomeIcon", icon: faHome },
  { id: 38, name: "PlayCircleIcon", icon: faPlayCircle },
  { id: 39, name: "HeadphoneIcon", icon: faHeadphones },
  { id: 40, name: "ThumbsUpIcon", icon: faThumbsUp },
  { id: 41, name: "RefreshIcon", icon: faRotate },
  { id: 42, name: "LockClosedIcon", icon: faLock },
  { id: 43, name: "CreditCardIcon", icon: faCreditCard },
  { id: 44, name: "CurrencyBitcoinIcon", icon: faBitcoinSign },
  { id: 45, name: "DashboardIcon", icon: faGauge },
  { id: 46, name: "OrderHistoryIcon", icon: faList },
  { id: 47, name: "SettingsIcon", icon: faGear },
  { id: 48, name: "LogoutIcon", icon: faArrowRightFromBracket },
  { id: 49, name: "FilterIcon", icon: faFilter },
  { id: 50, name: "InstagramProfileIcon", icon: faUserCircle },
  { id: 51, name: "TagIcon", icon: faTag },
];

const adminPanelIcons: IconItem[] = [
  { id: 1, name: "ClipboardDocumentListIcon", icon: faClipboardList },
  { id: 2, name: "CubeIcon", icon: faCube },
  { id: 3, name: "CogIcon", icon: faGear },
  { id: 4, name: "ChartIcon", icon: faChartBar },
  { id: 5, name: "CurrencyDollarIcon", icon: faDollarSign },
  { id: 6, name: "PhotoIcon", icon: faImage },
];

const socialPaymentBrandIcons: IconItem[] = [
  { id: 1, name: "VisaIcon", isCustom: true, customText: "VISA" },
  { id: 2, name: "MastercardIcon", isCustom: true, customText: "MC" },
  { id: 3, name: "AmexIcon", isCustom: true, customText: "AMEX" },
  { id: 4, name: "DiscoverIcon", isCustom: true, customText: "DIS" },
  { id: 5, name: "ApplePayIcon", isCustom: true, customText: "AP" },
  { id: 6, name: "AppleIcon", isCustom: true, customText: "🍎" },
  { id: 7, name: "FacebookIcon", isCustom: true, customText: "f" },
  { id: 8, name: "TwitterIcon", isCustom: true, customText: "X" },
  { id: 9, name: "LinkedInIcon", isCustom: true, customText: "in" },
  { id: 10, name: "InstagramIcon", isCustom: true, customText: "IG" },
  { id: 11, name: "OriginalInstagramIcon", isCustom: true, customText: "IG" },
  { id: 12, name: "OriginalTikTokIcon", isCustom: true, customText: "TT" },
  { id: 13, name: "OriginalYouTubeIcon", isCustom: true, customText: "YT" },
  { id: 14, name: "SoundwaveIcon", isCustom: true, customText: "~" },
  { id: 15, name: "USFlagIcon", isCustom: true, customText: "🇺🇸" },
];

const servicePlatformIcons: IconItem[] = [
  { id: 1, name: "InstagramServicesIcon", isCustom: true, customText: "IG" },
  { id: 2, name: "FollowersIcon", icon: faUser },
  { id: 3, name: "LikesIcon", icon: faHeart },
  { id: 4, name: "ViewsIcon", icon: faEye },
  { id: 5, name: "AutomaticLikesIcon", icon: faHeart },
  { id: 6, name: "TikTokFollowersIcon", icon: faUser },
  { id: 7, name: "TikTokViewsIcon", icon: faEye },
  { id: 8, name: "YouTubeSubscribersIcon", icon: faUser },
  { id: 9, name: "YouTubeLikesIcon", icon: faThumbsUp },
  { id: 10, name: "YouTubeViewsIcon", icon: faEye },
  { id: 11, name: "RocketLaunchIcon", icon: faFire },
  { id: 12, name: "InstagramLikesShortcutIcon", icon: faHeart },
  { id: 13, name: "InstagramViewsShortcutIcon", icon: faEye },
  { id: 14, name: "InstagramFollowersShortcutIcon", icon: faUser },
  { id: 15, name: "TikTokLikesShortcutIcon", icon: faHeart },
  { id: 16, name: "TikTokFollowersShortcutIcon", icon: faUser },
  { id: 17, name: "YouTubeLikesShortcutIcon", icon: faThumbsUp },
  { id: 18, name: "YouTubeSubscribersShortcutIcon", icon: faUser },
  { id: 19, name: "YouTubeViewsShortcutIcon", icon: faEye },
];

export default function IconManagementDashboard() {
  const handleReplaceClick = (id: number) => {
    const input = document.getElementById(`icon-file-${id}`) as HTMLInputElement | null;
    if (input) input.click();
  };

  const renderReplaceControl = (id: number) => (
    <>
      <button className="icon-replace-btn" onClick={() => handleReplaceClick(id)}>
        Replace
      </button>
      <input
        id={`icon-file-${id}`}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp"
        style={{ display: "none" }}
        onChange={(e) => {
          // Placeholder: integrate upload logic
          if (e.target.files && e.target.files[0]) {
            // eslint-disable-next-line no-console
            console.log("Selected icon file for", id, e.target.files[0].name);
          }
        }}
      />
    </>
  );

  const renderIcon = (item: IconItem) => {
    if (item.isCustom) {
      return (
        <div className="icon-custom-display">
          <span>{item.customText}</span>
        </div>
      );
    }
    return <FontAwesomeIcon icon={item.icon} className="icon-fa-display" />;
  };

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

            {/* Logos */}
            <div className="icon-section">
              <h2 className="icon-section-title">Logos</h2>
              <div className="icon-grid">
                {logos.map((icon) => (
                  <div key={icon.id} className="icon-card">
                    <div className="icon-display">{renderIcon(icon)}</div>
                    <div className="icon-name">{icon.name}</div>
                    {renderReplaceControl(icon.id)}
                  </div>
                ))}
              </div>
            </div>

            {/* General UI Icons */}
            <div className="icon-section">
              <h2 className="icon-section-title">General UI Icons</h2>
              <div className="icon-grid">
                {generalIcons.map((icon) => (
                  <div key={icon.id} className="icon-card">
                    <div className="icon-display">{renderIcon(icon)}</div>
                    <div className="icon-name">{icon.name}</div>
                    {renderReplaceControl(icon.id)}
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Panel Icons */}
            <div className="icon-section">
              <h2 className="icon-section-title">Admin Panel Icons</h2>
              <div className="icon-grid">
                {adminPanelIcons.map((icon) => (
                  <div key={icon.id} className="icon-card">
                    <div className="icon-display">{renderIcon(icon)}</div>
                    <div className="icon-name">{icon.name}</div>
                    {renderReplaceControl(icon.id)}
                  </div>
                ))}
              </div>
            </div>

            {/* Social, Payment, & Brand Icons */}
            <div className="icon-section">
              <h2 className="icon-section-title">Social, Payment, & Brand Icons</h2>
              <div className="icon-grid">
                {socialPaymentBrandIcons.map((icon) => (
                  <div key={icon.id} className="icon-card">
                    <div className="icon-display">{renderIcon(icon)}</div>
                    <div className="icon-name">{icon.name}</div>
                    {renderReplaceControl(icon.id)}
                  </div>
                ))}
              </div>
            </div>

            {/* Service & Platform Icons */}
            <div className="icon-section">
              <h2 className="icon-section-title">Service & Platform Icons</h2>
              <div className="icon-grid">
                {servicePlatformIcons.map((icon) => (
                  <div key={icon.id} className="icon-card">
                    <div className="icon-display">{renderIcon(icon)}</div>
                    <div className="icon-name">{icon.name}</div>
                    {renderReplaceControl(icon.id)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

