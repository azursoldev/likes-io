"use client";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";

export default function PayoutsDashboard() {
  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="payouts" />

        <main className="admin-main">
          <AdminToolbar title="Payouts" />
          <div className="admin-content">
            <div className="payouts-header">
              <h2>Payout Requests</h2>
              <p>Review and process pending payout requests from affiliates.</p>
            </div>

            <div className="payout-table-card">
              <table className="aff-table">
                <thead>
                  <tr>
                    <th>Affiliate</th>
                    <th>Request Date</th>
                    <th>Amount</th>
                    <th>Payout Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="payout-empty" colSpan={5}>
                      No pending payout requests.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

