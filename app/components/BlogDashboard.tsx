"use client";
import { useState } from "react";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faPlus,
  faCalendar,
  faPencil,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

type BlogPost = {
  id: number;
  title: string;
  description: string;
  authorId: number;
  date: string;
  status: boolean;
};

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The 2024 Instagram Algorithm: A Deep Dive for Creators",
    description: "Tired of guessing what works? We're pulling back the curtain on the Instagram algorithm. Learn about the key ranking signals for Reels, Stories, and the feed to maximize your reach.",
    authorId: 1,
    date: "2024-01-15",
    status: false,
  },
  {
    id: 2,
    title: "5 Content Pillars Every Successful Brand Needs on Instagram",
    description: "Stop posting randomly. Discover how to build a powerful content strategy around 5 key pillars that will attract, engage, and convert your target audience.",
    authorId: 1,
    date: "2024-01-10",
    status: false,
  },
  {
    id: 3,
    title: "Beyond the Follower Count: The Real Power of Social Proof",
    description: "Why does social proof matter more than ever? Learn the psychology behind it and how to leverage likes and views to build trust and credibility with new visitors.",
    authorId: 1,
    date: "2024-01-05",
    status: false,
  },
  {
    id: 4,
    title: "From 1k to 50k Followers in 90 Days: A Likes.io Case Study",
    description: "We break down the exact strategy a small e-commerce brand used, combining our services with organic tactics, to achieve explosive growth and a 200% increase in sales.",
    authorId: 1,
    date: "2023-12-28",
    status: false,
  },
  {
    id: 5,
    title: "Is Your Instagram Bio Costing You Followers? How to Fix It.",
    description: "Your bio is your brand's elevator pitch. We provide a simple, effective template and tips to optimize your bio for maximum impact and follower conversion.",
    authorId: 1,
    date: "2023-12-20",
    status: false,
  },
  {
    id: 6,
    title: "TikTok vs. Instagram Reels: Where Should You Focus in 2024?",
    description: "The ultimate showdown. We analyze the pros, cons, and key audience differences between TikTok and Reels to help you decide where to invest your creative energy.",
    authorId: 1,
    date: "2023-12-15",
    status: false,
  },
  {
    id: 7,
    title: "The Technical Side of Trust: Why Our Service is Safe",
    description: "Go behind the scenes with our Head of Technology to understand the secure methods we use to deliver engagement, ensuring your account's safety is always the top priority.",
    authorId: 1,
    date: "2023-12-10",
    status: false,
  },
];

export default function BlogDashboard() {
  const [posts, setPosts] = useState(blogPosts);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    publishDate: "",
    published: false,
  });

  const handleToggleStatus = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, status: !post.status } : post
    ));
  };

  const handleEdit = (id: number) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setSelectedPost(post);
      setEditForm({
        title: post.title,
        excerpt: post.description,
        content: "",
        featuredImageUrl: "",
        publishDate: post.date,
        published: post.status,
      });
      setShowEditModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedPost(null);
    setEditForm({
      title: "",
      excerpt: "",
      content: "",
      featuredImageUrl: "",
      publishDate: "",
      published: false,
    });
  };

  const handleSavePost = () => {
    if (selectedPost) {
      setPosts(posts.map(post => 
        post.id === selectedPost.id ? {
          ...post,
          title: editForm.title,
          description: editForm.excerpt,
          date: editForm.publishDate,
          status: editForm.published,
        } : post
      ));
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="blog" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Blog</h1>
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

          <div className="blog-hero">
            <div className="blog-hero-left">
              <h1>Blog Management</h1>
              <p>Create, edit, and manage all blog posts.</p>
            </div>
            <div className="blog-hero-right">
              <button className="blog-add-btn">
                <FontAwesomeIcon icon={faPlus} />
                <span>New Post</span>
              </button>
            </div>
          </div>

          <div className="blog-table-wrapper">
            <table className="blog-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="blog-id-cell">
                      <span>{post.id}</span>
                    </td>
                    <td className="blog-title-cell">
                      <div className="blog-title-content">
                        <h3 className="blog-post-title">{post.title}</h3>
                        <p className="blog-post-description">{post.description}</p>
                      </div>
                    </td>
                    <td className="blog-author-cell">
                      <span>ID: {post.authorId}</span>
                    </td>
                    <td className="blog-date-cell">
                      <FontAwesomeIcon icon={faCalendar} className="blog-calendar-icon" />
                      <span>{formatDate(post.date)}</span>
                    </td>
                    <td className="blog-status-cell">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={post.status}
                          onChange={() => handleToggleStatus(post.id)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td className="blog-actions-cell">
                      <button className="blog-edit-btn" onClick={() => handleEdit(post.id)}>
                        Edit
                      </button>
                      <button className="blog-delete-btn" onClick={() => handleDelete(post.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showEditModal && (
        <div className="blog-edit-modal-overlay" onClick={handleCloseModal}>
          <div className="blog-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="blog-edit-modal-header">
              <h2>Edit Post</h2>
              <button className="blog-edit-modal-close" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="blog-edit-modal-body">
              <div className="blog-edit-form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  type="text"
                  id="edit-title"
                  className="blog-edit-input"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div className="blog-edit-form-group">
                <label htmlFor="edit-excerpt">Excerpt</label>
                <textarea
                  id="edit-excerpt"
                  className="blog-edit-textarea"
                  rows={3}
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                />
              </div>

              <div className="blog-edit-form-group">
                <label htmlFor="edit-content">Content</label>
                <div className="blog-edit-toolbar">
                  <button type="button" className="blog-edit-toolbar-btn">P</button>
                  <button type="button" className="blog-edit-toolbar-btn">H2</button>
                  <button type="button" className="blog-edit-toolbar-btn">H3</button>
                  <button type="button" className="blog-edit-toolbar-btn">B</button>
                  <button type="button" className="blog-edit-toolbar-btn">Image</button>
                  <button type="button" className="blog-edit-toolbar-btn">Audio</button>
                  <button type="button" className="blog-edit-toolbar-btn">UL</button>
                  <button type="button" className="blog-edit-toolbar-btn">Callout</button>
                  <button type="button" className="blog-edit-toolbar-btn">Pros</button>
                  <button type="button" className="blog-edit-toolbar-btn">Cons</button>
                  <button type="button" className="blog-edit-toolbar-btn">FAQ</button>
                </div>
                <textarea
                  id="edit-content"
                  className="blog-edit-textarea blog-edit-content-textarea"
                  rows={15}
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="[B]Visual Quality:[/B] The algorithm now actively penalizes low-resolution videos..."
                />
              </div>

              <div className="blog-edit-form-group">
                <label htmlFor="edit-featured-image">Featured Image URL</label>
                <input
                  type="text"
                  id="edit-featured-image"
                  className="blog-edit-input"
                  value={editForm.featuredImageUrl}
                  onChange={(e) => setEditForm({ ...editForm, featuredImageUrl: e.target.value })}
                  placeholder="https://source.unsplash.com/800x500/?social-"
                />
              </div>

              <div className="blog-edit-form-group">
                <label htmlFor="edit-publish-date">Publish Date</label>
                <div className="blog-edit-date-wrapper">
                  <input
                    type="text"
                    id="edit-publish-date"
                    className="blog-edit-input"
                    value={editForm.publishDate}
                    onChange={(e) => setEditForm({ ...editForm, publishDate: e.target.value })}
                    placeholder="mm/dd/yyyy"
                  />
                  <FontAwesomeIcon icon={faCalendar} className="blog-edit-calendar-icon" />
                </div>
              </div>

              <div className="blog-edit-form-group blog-edit-toggle-group">
                <label htmlFor="edit-published">Published</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="edit-published"
                    checked={editForm.published}
                    onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <div className="blog-edit-modal-footer">
              <button className="blog-edit-btn cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="blog-edit-btn save" onClick={handleSavePost}>
                Save Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

