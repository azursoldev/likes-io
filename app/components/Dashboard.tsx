"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../dashboard/dashboard.css";
import {
  faTh,
  faList,
  faLink,
  faQuestionCircle,
  faGear,
  faSignOutAlt,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp,
  faUser,
  faEye,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import Header from "./Header";
import Footer from "./Footer";

export default function Dashboard() {

  const services = [
    {
      platform: "Instagram",
      type: "Likes",
      icon: faThumbsUp,
      href: "/instagram/likes",
      text: "Get likes now",
      iconBgClass: "icon-bg-instagram-likes",
    },
    {
      platform: "Instagram",
      type: "Followers",
      icon: faUser,
      href: "/instagram/followers",
      text: "Get followers now",
      iconBgClass: "icon-bg-instagram-followers",
    },
    {
      platform: "Instagram",
      type: "Views",
      icon: faEye,
      href: "/instagram/views",
      text: "Get views now",
      iconBgClass: "icon-bg-instagram-views",
    },
    {
      platform: "TikTok",
      type: "Likes",
      icon: faHeart,
      href: "/tiktok/likes",
      text: "Get likes now",
      iconBgClass: "icon-bg-tiktok",
    },
    {
      platform: "TikTok",
      type: "Followers",
      icon: faUser,
      href: "/tiktok/followers",
      text: "Get followers now",
      iconBgClass: "icon-bg-tiktok",
    },
    {
      platform: "TikTok",
      type: "Views",
      icon: faEye,
      href: "/tiktok/views",
      text: "Get views now",
      iconBgClass: "icon-bg-tiktok",
    },
    {
      platform: "YouTube",
      type: "Likes",
      icon: faThumbsUp,
      href: "/youtube/likes",
      text: "Get likes now",
      iconBgClass: "icon-bg-youtube",
    },
    {
      platform: "YouTube",
      type: "Subscribers",
      icon: faUser,
      href: "/youtube/subscribers",
      text: "Get subscribers now",
      iconBgClass: "icon-bg-youtube",
    },
    {
      platform: "YouTube",
      type: "Views",
      icon: faEye,
      href: "/youtube/views",
      text: "Get views now",
      iconBgClass: "icon-bg-youtube",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-brand">
            <a href="/" className="brand-logo">
              <span className="logo-text">Likes</span>
              <span className="logo-dot">.io</span>
            </a>
          </div>
          <nav className="dashboard-sidebar-nav">
            <div>
              <a href="/dashboard" className="dashboard-sidebar-link active">
                <FontAwesomeIcon icon={faTh} />
                <span>Dashboard</span>
              </a>
              <a href="/dashboard/orders" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faList} />
                <span>Order History</span>
              </a>
            <a href="/dashboard/affiliate" className="dashboard-sidebar-link">
              <FontAwesomeIcon icon={faLink} />
              <span>Affiliate</span>
            </a>
              <a href="/dashboard/support" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Help & Support</span>
              </a>
            </div>
            <div className="dashboard-sidebar-nav-bottom">
              <div className="dashboard-sidebar-divider"></div>
              <a href="/dashboard/settings" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faGear} />
                <span>Settings</span>
              </a>
              <a href="/login" className="dashboard-sidebar-link">
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Log Out</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="container">
            <div className="dashboard-content-header">
              <h1 className="dashboard-title">Welcome back!</h1>
              <div className="dashboard-help">
                <span className="dashboard-help-text">Need help?</span>
                <a href="/dashboard/support" className="dashboard-support-btn">
                  <FontAwesomeIcon icon={faStar} />
                  <span>Get support</span>
                </a>
              </div>
            </div>

            <div className="dashboard-services-grid">
              {services.map((service, index) => (
                <a
                  key={index}
                  href={service.href}
                  className="dashboard-service-card"
                >
                  <div className={`dashboard-service-icon ${service.iconBgClass}`}>
                    <FontAwesomeIcon icon={service.icon} />
                  </div>
                  <div className="dashboard-service-content">
                    <h3 className="dashboard-service-title">
                      {service.platform} {service.type}
                    </h3>
                    <p className="dashboard-service-text">{service.text}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

