"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faGauge,
  faCreditCard,
  faUsers,
  faCheckCircle,
  faQuoteLeft,
  faQuestionCircle,
  faUserGroup,
  faBell,
  faHandshake,
  faMoneyBillWave,
  faThumbsUp,
  faStar,
  faHome,
  faGear,
  faDollarSign,
  faSliders,
  faSitemap,
  faServer,
  faIcons,
  faArrowRightFromBracket,
  faWrench,
  faNewspaper,
  faFileContract,
  faShieldHalved,
  faTicket,
  faTag,
  faGift,
} from "@fortawesome/free-solid-svg-icons";
import { getAdminUrl } from "@/lib/url-utils";
import { useSettings } from "../contexts/SettingsContext";

type NavItem = {
  label: string;
  icon: any;
  active?: boolean;
  href?: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

type AdminSidebarProps = {
  activePage?:
    | "dashboard"
    | "revenue"
    | "users"
    | "orders"
    | "services"
    | "blog"
    | "reviewModeration"
    | "testimonials"
    | "faq"
    | "team"
    | "notifications"
    | "payouts"
    | "affiliate"
  | "socialProof"
  | "featuredOn"
  | "homepageContent"
  | "navigation"
  | "settings"
  | "currencyRates"
  | "smmPanel"
  | "systemStatus"
  | "iconManagement"
  | "support"
  | "terms"
    | "privacy"
    | "coupons"
    | "upsells"
    | "freeTools";
};

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const router = useRouter();
  const { headerLogoUrl } = useSettings() as any;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = window.location.origin + "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: redirect manually if signOut fails
      router.push("/");
    }
  };

  const navSections: NavSection[] = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", icon: faGauge, active: activePage === "dashboard", href: getAdminUrl() },
        { label: "Revenue", icon: faCreditCard, active: activePage === "revenue", href: getAdminUrl("revenue") },
        { label: "Users", icon: faUsers, active: activePage === "users", href: getAdminUrl("users") },
        { label: "Orders", icon: faShoppingCart, active: activePage === "orders", href: getAdminUrl("orders") },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "Services", icon: faWrench, active: activePage === "services", href: getAdminUrl("services") },
        { label: "Blog", icon: faNewspaper, active: activePage === "blog", href: getAdminUrl("blog") },
        { label: "Review Moderation", icon: faCheckCircle, active: activePage === "reviewModeration", href: getAdminUrl("review-moderation") },
        { label: "Published Testimonials", icon: faQuoteLeft, active: activePage === "testimonials", href: getAdminUrl("testimonials") },
        { label: "Free Tools", icon: faGift, active: activePage === "freeTools", href: getAdminUrl("free-tools") },
        { label: "Terms of Service", icon: faFileContract, active: activePage === "terms", href: getAdminUrl("legal/terms") },
        { label: "Privacy Policy", icon: faShieldHalved, active: activePage === "privacy", href: getAdminUrl("legal/privacy") },
        { label: "FAQ", icon: faQuestionCircle, active: activePage === "faq", href: getAdminUrl("faq") },
        { label: "Team", icon: faUserGroup, active: activePage === "team", href: getAdminUrl("team") },
      ],
    },
    {
      title: "Marketing",
      items: [
        { label: "Coupons", icon: faTicket, active: activePage === "coupons", href: getAdminUrl("coupons") },
        { label: "Upsells", icon: faTag, active: activePage === "upsells", href: getAdminUrl("upsells") },
        { label: "Notifications", icon: faBell, active: activePage === "notifications", href: getAdminUrl("notifications") },
        { label: "Affiliates", icon: faHandshake, active: activePage === "affiliate", href: getAdminUrl("affiliate") },
        { label: "Payouts", icon: faMoneyBillWave, active: activePage === "payouts", href: getAdminUrl("payouts") },
        { label: "Social Proof", icon: faThumbsUp, active: activePage === "socialProof", href: getAdminUrl("social-proof") },
        { label: "Featured On", icon: faStar, active: activePage === "featuredOn", href: getAdminUrl("featured-on") },
        { label: "Homepage Content", icon: faHome, active: activePage === "homepageContent", href: getAdminUrl("homepage-content") },
        { label: "Navigation", icon: faSitemap, active: activePage === "navigation", href: getAdminUrl("navigation") },
      ],
    },
    {
      title: "Configuration",
      items: [
        { label: "Site Settings", icon: faGear, active: activePage === "settings", href: getAdminUrl("settings") },
        { label: "Currency Rates", icon: faDollarSign, active: activePage === "currencyRates", href: getAdminUrl("currency-rates") },
        { label: "SMM Panel", icon: faSliders, active: activePage === "smmPanel", href: getAdminUrl("smm-panel") },
        { label: "System Status", icon: faServer, active: activePage === "systemStatus", href: getAdminUrl("system-status") },
        { label: "Icon Management", icon: faIcons, active: activePage === "iconManagement", href: getAdminUrl("icon-management") },
      ],
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo-block">
        {headerLogoUrl ? (
          <img 
            src={headerLogoUrl} 
            alt="Likes.io" 
            style={{ maxHeight: '40px', maxWidth: '100%', objectFit: 'contain' }} 
          />
        ) : (
          <span className="logo-text-full">likes.io</span>
        )}
      </div>
      <nav>
        {navSections.map((section) => (
          <div key={section.title} className="nav-section-block">
            <div className="admin-nav-section">{section.title}</div>
            {section.items.map((item) => (
              <a
                key={item.label}
                className={`admin-nav-link ${item.active ? "active" : ""}`}
                href={item.href || "#"}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        ))}
        <button 
          className="admin-nav-link danger" 
          onClick={handleLogout}
          type="button"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>Log Out</span>
        </button>
      </nav>
    </aside>
  );
}

