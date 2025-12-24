"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../admin/dashboard.css";
import Header from "./Header";
import Footer from "./Footer";
import UserSidebar from "./UserSidebar";
import {
  faThumbsUp,
  faUser,
  faEye,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@/app/hooks/useNavigation";

export default function Dashboard() {
  const { getLink } = useNavigation();

  const services = [
    {
      platform: "Instagram",
      type: "Likes",
      icon: faThumbsUp,
      href: getLink("instagram", "likes"),
      text: "Get likes now",
      iconBgClass: "icon-bg-instagram-likes",
    },
    {
      platform: "Instagram",
      type: "Followers",
      icon: faUser,
      href: getLink("instagram", "followers"),
      text: "Get followers now",
      iconBgClass: "icon-bg-instagram-followers",
    },
    {
      platform: "Instagram",
      type: "Views",
      icon: faEye,
      href: getLink("instagram", "views"),
      text: "Get views now",
      iconBgClass: "icon-bg-instagram-views",
    },
    {
      platform: "TikTok",
      type: "Likes",
      icon: faHeart,
      href: getLink("tiktok", "likes"),
      text: "Get likes now",
      iconBgClass: "icon-bg-tiktok",
    },
    {
      platform: "TikTok",
      type: "Followers",
      icon: faUser,
      href: getLink("tiktok", "followers"),
      text: "Get followers now",
      iconBgClass: "icon-bg-tiktok",
    },
    {
      platform: "TikTok",
      type: "Views",
      icon: faEye,
      href: getLink("tiktok", "views"),
      text: "Get views now",
      iconBgClass: "icon-bg-tiktok",
    },
    {
      platform: "YouTube",
      type: "Likes",
      icon: faThumbsUp,
      href: getLink("youtube", "likes"),
      text: "Get likes now",
      iconBgClass: "icon-bg-youtube",
    },
    {
      platform: "YouTube",
      type: "Subscribers",
      icon: faUser,
      href: getLink("youtube", "subscribers"),
      text: "Get subscribers now",
      iconBgClass: "icon-bg-youtube",
    },
    {
      platform: "YouTube",
      type: "Views",
      icon: faEye,
      href: getLink("youtube", "views"),
      text: "Get views now",
      iconBgClass: "icon-bg-youtube",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="dashboard-container">
        <UserSidebar active="dashboard" />

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

