import type { Metadata } from "next";
import UserSettings from "../../components/UserSettings";
import UserSidebar from "../../components/UserSidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../dashboard.css";
export const metadata: Metadata = {
  title: "Settings | Likes.io",
  description: "Manage your account settings, profile information, and notification preferences.",
};

export default function Page() {
  return (
    <div className="dashboard-wrapper">
      <Header />
      <div className="dashboard-container">
        <UserSidebar active="settings" />
        <main className="dashboard-main">
          <div className="dashboard-main-inner">
            <UserSettings />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

