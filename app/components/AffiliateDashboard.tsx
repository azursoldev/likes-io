"use client";
import "../admin/dashboard.css";
import Header from "./Header";
import Footer from "./Footer";
import UserSidebar from "./UserSidebar";

export default function AffiliateDashboard() {
  return (
    <div className="dashboard-wrapper">
      <Header />

      <div className="dashboard-container">
        <UserSidebar active="affiliate" />

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="container">
            <div className="affiliate-dashboard-content">
              <p className="affiliate-no-data">No affiliate data available</p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

