"use client";
import { useState } from "react";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faFilter,
  faSort,
  faStar,
  faEdit,
  faTrash,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

type Testimonial = {
  id: number;
  author: string;
  testimonial: string;
  rating: number;
  date: string; // Relative time like "10m", "1h", "1d", "1w", "1m", "1y"
  status: "approved" | "pending";
};

const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    author: "@john_doe_official",
    testimonial: "This is an amazing product, I love it and would highly recommend it to everyone...",
    rating: 5.0,
    date: "10m",
    status: "approved",
  },
  {
    id: 2,
    author: "Jane Smith",
    testimonial: "Great service and very helpful customer support. The team really cares about their customers...",
    rating: 5.0,
    date: "1h",
    status: "approved",
  },
  {
    id: 3,
    author: "@tiktok_creator",
    testimonial: "Highly recommend this company for anyone looking to boost their social media presence...",
    rating: 4.5,
    date: "1d",
    status: "approved",
  },
  {
    id: 4,
    author: "Mike Johnson",
    testimonial: "Excellent results! My engagement has increased significantly since using this service...",
    rating: 5.0,
    date: "1w",
    status: "approved",
  },
  {
    id: 5,
    author: "@instagram_user",
    testimonial: "Fast delivery and great quality. Will definitely use again in the future...",
    rating: 5.0,
    date: "1m",
    status: "approved",
  },
  {
    id: 6,
    author: "Sarah Williams",
    testimonial: "Good service overall, though there were some minor delays. Still satisfied with the results...",
    rating: 4.0,
    date: "1y",
    status: "pending",
  },
  {
    id: 7,
    author: "@youtube_creator",
    testimonial: "Outstanding support and quick turnaround time. Very professional team...",
    rating: 5.0,
    date: "2d",
    status: "approved",
  },
  {
    id: 8,
    author: "David Brown",
    testimonial: "The best investment I've made for my social media growth. Results speak for themselves...",
    rating: 5.0,
    date: "3d",
    status: "approved",
  },
];

export default function TestimonialsDashboard() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    // Edit functionality can be implemented later
    console.log("Edit testimonial:", id);
  };

  const filteredTestimonials = testimonials.filter((t) =>
    t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.testimonial.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Published Testimonials</h1>
                </div>
                <div className="admin-toolbar-right">
                  <div className="admin-search-pill">
                    <span className="search-icon">🔍</span>
                    <input placeholder="Search..." aria-label="Search" />
                  </div>
                  <button className="admin-icon-btn" aria-label="Notifications">
                    <FontAwesomeIcon icon={faBell} />
                  </button>
                  <div className="admin-user-chip">
                    <div className="chip-avatar">AU</div>
                    <div className="chip-meta">
                      <span className="chip-name">Admin User</span>
                      <span className="chip-role">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonials-hero">
            <div className="testimonials-hero-left">
              <h1>Testimonial Management</h1>
              <p>Manage your testimonials, approve or delete them, or publish them on your site.</p>
            </div>
          </div>

          <div className="testimonials-action-bar">
            <div className="testimonials-search-container">
              <div className="testimonials-search-input">
                <FontAwesomeIcon icon={faSearch} className="testimonials-search-icon" />
                <input
                  type="text"
                  placeholder="Go Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search testimonials"
                />
              </div>
              <button className="testimonials-icon-btn" aria-label="Filter">
                <FontAwesomeIcon icon={faFilter} />
              </button>
              <button className="testimonials-icon-btn" aria-label="Sort">
                <FontAwesomeIcon icon={faSort} />
              </button>
            </div>
            <button className="testimonials-add-btn">
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Testimonial</span>
            </button>
          </div>

          <div className="testimonials-table-wrapper">
            <table className="testimonials-table">
              <thead>
                <tr>
                  <th>
                    <FontAwesomeIcon icon={faUser} className="testimonials-th-icon" />
                    Author
                  </th>
                  <th>Testimonial</th>
                  <th>
                    <FontAwesomeIcon icon={faStar} className="testimonials-th-icon" />
                    Rating
                  </th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td className="testimonials-author-cell">
                      <div className="testimonials-author-content">
                        <div className="testimonials-avatar">
                          {testimonial.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="testimonials-author-name">{testimonial.author}</span>
                      </div>
                    </td>
                    <td className="testimonials-text-cell">
                      <p className="testimonials-text">{testimonial.testimonial}</p>
                    </td>
                    <td className="testimonials-rating-cell">
                      <div className="testimonials-rating-content">
                        <span className="testimonials-rating-value">{testimonial.rating}</span>
                        <FontAwesomeIcon icon={faStar} className="testimonials-rating-star" />
                      </div>
                    </td>
                    <td className="testimonials-date-cell">
                      <span>{testimonial.date}</span>
                    </td>
                    <td className="testimonials-status-cell">
                      <button
                        className={`testimonials-status-btn ${
                          testimonial.status === "approved" ? "status-approved" : "status-pending"
                        }`}
                      >
                        {testimonial.status === "approved" ? "Approved" : "Pending"}
                      </button>
                    </td>
                    <td className="testimonials-actions-cell">
                      <button
                        className="testimonials-edit-btn"
                        onClick={() => handleEdit(testimonial.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="testimonials-delete-btn"
                        onClick={() => handleDelete(testimonial.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTestimonials.length === 0 && (
              <div className="no-testimonials-message">No testimonials found.</div>
            )}
          </div>

          <div className="testimonials-pagination">
            <button className="testimonials-pagination-btn" disabled>
              ‹
            </button>
            <button className="testimonials-pagination-btn active">1</button>
            <button className="testimonials-pagination-btn">2</button>
            <button className="testimonials-pagination-btn">›</button>
          </div>
        </main>
      </div>
    </div>
  );
}

