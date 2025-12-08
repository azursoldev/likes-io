"use client";
import "../dashboard/dashboard.css";
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
  activePage?: "dashboard" | "revenue" | "users" | "orders" | "services" | "blog" | "reviewModeration";
};

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const navSections: NavSection[] = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", icon: faGauge, active: activePage === "dashboard", href: "/dashboard" },
        { label: "Revenue", icon: faCreditCard, active: activePage === "revenue", href: "/dashboard/revenue" },
        { label: "Users", icon: faUsers, active: activePage === "users", href: "/dashboard/users" },
        { label: "Orders", icon: faShoppingCart, active: activePage === "orders", href: "/dashboard/orders" },
      ],
    },
    {
      title: "Content",
      items: [
        { label: "Services", icon: faWrench, active: activePage === "services", href: "/dashboard/services" },
        { label: "Blog", icon: faNewspaper, active: activePage === "blog", href: "/dashboard/blog" },
        { label: "Review Moderation", icon: faCheckCircle, active: activePage === "reviewModeration", href: "/dashboard/review-moderation" },
        { label: "Published Testimonials", icon: faQuoteLeft, href: "/dashboard/testimonials" },
        { label: "FAQ", icon: faQuestionCircle },
        { label: "Team", icon: faUserGroup },
      ],
    },
    {
      title: "Marketing",
      items: [
        { label: "Notifications", icon: faBell },
        { label: "Affiliates", icon: faHandshake },
        { label: "Payouts", icon: faMoneyBillWave },
        { label: "Social Proof", icon: faThumbsUp },
        { label: "Featured On", icon: faStar },
        { label: "Homepage Content", icon: faHome },
      ],
    },
    {
      title: "Configuration",
      items: [
        { label: "Site Settings", icon: faGear },
        { label: "Currency Rates", icon: faDollarSign },
        { label: "SMM Panel", icon: faSliders },
        { label: "System Status", icon: faServer },
        { label: "Icon Management", icon: faIcons },
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

