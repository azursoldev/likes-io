"use client";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type Affiliate = {
  id: number;
  name: string;
  referralLink: string;
  clicks: number;
  salesValue: string;
  commission: string;
  status: "Active" | "Paused";
};

const initialAffiliates: Affiliate[] = [];

export default function AffiliatesDashboard() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(initialAffiliates);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setReferralCode("");
    setCommissionRate("");
  };

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) return;
    const code = referralCode.trim() || "new";
    const newAffiliate: Affiliate = {
      id: Date.now(),
      name: fullName.trim(),
      referralLink: `likes.io/r/${code}`,
      clicks: 0,
      salesValue: "$0",
      commission: "$0",
      status: "Active",
    };
    setAffiliates((prev) => [...prev, newAffiliate]);
    resetForm();
    setShowModal(false);
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="affiliate" />

        <main className="admin-main">
          <AdminToolbar title="Affiliates" />

          <div className="aff-header">
            <div>
              <h2>Affiliates</h2>
              <p>Manage affiliates, referral links, and commissions.</p>
            </div>
            <button className="aff-add-btn" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Affiliate</span>
            </button>
          </div>

          <div className="aff-table-card">
            <table className="aff-table">
              <thead>
                <tr>
                  <th>Affiliate</th>
                  <th>Referral Link</th>
                  <th>Clicks / Signups</th>
                  <th>Sales Value</th>
                  <th>Commission / Earnings</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.referralLink}</td>
                    <td>{a.clicks}</td>
                    <td>{a.salesValue}</td>
                    <td>{a.commission}</td>
                    <td>
                      <span className={`aff-status ${a.status === "Active" ? "on" : "off"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="team-actions">
                      <button className="team-edit">Edit</button>
                      <button className="team-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="faq-modal-backdrop">
              <div className="faq-modal">
                <div className="faq-modal-header">
                  <h3>Add New Affiliate</h3>
                  <button
                    className="faq-modal-close"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <div className="faq-modal-body">
                  <div className="modal-row two-col">
                    <label className="faq-modal-label">
                      Full Name
                      <input
                        className="faq-modal-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                      />
                    </label>
                    <label className="faq-modal-label">
                      Email
                      <input
                        className="faq-modal-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                    </label>
                  </div>

                  <div className="modal-row two-col">
                    <label className="faq-modal-label">
                      Referral Code
                      <input
                        className="faq-modal-input"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        placeholder="Referral Code"
                      />
                    </label>
                    <label className="faq-modal-label">
                      Commission Rate (%)
                      <input
                        className="faq-modal-input"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value)}
                        placeholder="e.g., 10"
                      />
                    </label>
                  </div>
                </div>

                <div className="faq-modal-footer">
                  <button
                    className="faq-modal-cancel"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="faq-modal-save"
                    onClick={handleSave}
                    disabled={!fullName.trim() || !email.trim()}
                  >
                    Save Affiliate
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

