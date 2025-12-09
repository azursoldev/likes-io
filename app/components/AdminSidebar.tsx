"use client";
import "../admin/dashboard.css";
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
  faServer,
  faIcons,
  faArrowRightFromBracket,
  faWrench,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";

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
  | "settings"
  | "currencyRates"
  | "smmPanel"
  | "systemStatus"
  | "iconManagement"
    | "support";
};

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const navSections: NavSection[] = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", icon: faGauge, active: activePage === "dashboard", href: "/admin" },
        { label: "Revenue", icon: faCreditCard, active: activePage === "revenue", href: "/admin/revenue" },
        { label: "Users", icon: faUsers, active: activePage === "users", href: "/admin/users" },
        { label: "Orders", icon: faShoppingCart, active: activePage === "orders", href: "/admin/orders" },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "Services", icon: faWrench, active: activePage === "services", href: "/admin/services" },
        { label: "Review Moderation", icon: faCheckCircle, active: activePage === "reviewModeration", href: "/admin/review-moderation" },
        { label: "Blog", icon: faNewspaper, active: activePage === "blog", href: "/admin/blog" },
        { label: "Published Testimonials", icon: faQuoteLeft, active: activePage === "testimonials", href: "/admin/testimonials" },
        { label: "FAQ", icon: faQuestionCircle, active: activePage === "faq", href: "/admin/faq" },
        { label: "Team", icon: faUserGroup, active: activePage === "team", href: "/admin/team" },
      ],
    },
    {
      title: "Marketing",
      items: [
        { label: "Notifications", icon: faBell, active: activePage === "notifications", href: "/admin/notifications" },
        { label: "Affiliates", icon: faHandshake, active: activePage === "affiliate", href: "/admin/affiliate" },
        { label: "Payouts", icon: faMoneyBillWave, active: activePage === "payouts", href: "/admin/payouts" },
        { label: "Social Proof", icon: faThumbsUp, active: activePage === "socialProof", href: "/admin/social-proof" },
        { label: "Featured On", icon: faStar, active: activePage === "featuredOn", href: "/admin/featured-on" },
        { label: "Homepage Content", icon: faHome, active: activePage === "homepageContent", href: "/admin/homepage-content" },
      ],
    },
    {
      title: "Configuration",
      items: [
        { label: "Site Settings", icon: faGear, active: activePage === "settings", href: "/admin/settings" },
        { label: "Currency Rates", icon: faDollarSign, active: activePage === "currencyRates", href: "/admin/currency-rates" },
        { label: "SMM Panel", icon: faSliders, active: activePage === "smmPanel", href: "/admin/smm-panel" },
        { label: "System Status", icon: faServer, active: activePage === "systemStatus", href: "/admin/system-status" },
        { label: "Icon Management", icon: faIcons, active: activePage === "iconManagement", href: "/admin/icon-management" },
      ],
    },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo-block">
        <span className="dot">•</span>
        <span className="logo-text">io</span>
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
        <a className="admin-nav-link danger" href="#">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>Log Out</span>
        </a>
      </nav>
    </aside>
  );
}

