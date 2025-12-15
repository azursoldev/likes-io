"use client";
import { useState, useEffect } from "react";
import "../admin/dashboard.css";
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

type BlogRow = {
  id: number;
  title: string;
  description: string;
  author: string;
  category?: string | null;
  date: string;
  status: boolean;
};

export default function BlogDashboard() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogRow | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    category: "General",
    publishDate: "",
    published: false,
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cms/blog");
      if (!res.ok) throw new Error("Failed to load blog posts");
      const data = await res.json();
      const rows: BlogRow[] = (data.posts || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.excerpt || "",
        author: p.author?.name || p.author?.email || "Unknown",
        category: p.category || "General",
        date: p.publishedAt || p.createdAt || new Date().toISOString(),
        status: !!p.isPublished,
      }));
      setPosts(rows);
    } catch (err: any) {
      console.error("Blog load error", err);
      setError(err.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const handleToggleStatus = (id: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, status: !post.status } : post
      )
    );
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
        category: post.category || "General",
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
      category: "General",
      publishDate: "",
      published: false,
    });
  };

  const handleSavePost = async () => {
    try {
      setError(null);

      // Create NEW post when no post is selected
      if (!selectedPost) {
        const slug = editForm.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

        const res = await fetch("/api/cms/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editForm.title,
            slug,
            excerpt: editForm.excerpt,
            content: editForm.content || "Draft content",
            featuredImage: editForm.featuredImageUrl || null,
            category: editForm.category || null,
            tags: null,
            isPublished: editForm.published,
            seoMeta: null,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create blog post");
        }

        await loadPosts();
        handleCloseModal();
        return;
      }

      // UPDATE existing post
      const res = await fetch(`/api/cms/blog?id=${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          excerpt: editForm.excerpt,
          content: editForm.content,
          featuredImage: editForm.featuredImageUrl || null,
          category: editForm.category || null,
          tags: null,
          isPublished: editForm.published,
          publishedAt: editForm.publishDate || null,
          seoMeta: null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update blog post");
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                title: editForm.title,
                description: editForm.excerpt,
                category: editForm.category,
                date: editForm.publishDate,
                status: editForm.published,
              }
            : post
        )
      );

      handleCloseModal();
    } catch (err: any) {
      console.error("Save blog post error", err);
      setError(err.message || "Failed to save blog post");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/cms/blog?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete blog post");
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err: any) {
      console.error("Delete blog post error", err);
      setError(err.message || "Failed to delete blog post");
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
          <div className="admin-content">
            <div className="blog-hero">
              <div className="blog-hero-left">
                <h1>Blog Management</h1>
                <p>Create, edit, and manage all blog posts.</p>
              </div>
              <div className="blog-hero-right">
                <button
                  className="blog-add-btn"
                  onClick={() => {
                    // Open empty modal ready to create a new post (client-side only for now)
                    setSelectedPost(null);
                    setEditForm({
                      title: "",
                      excerpt: "",
                      content: "",
                      featuredImageUrl: "",
                      category: "General",
                      publishDate: new Date().toISOString().slice(0, 10),
                      published: false,
                    });
                    setShowEditModal(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>New Post</span>
                </button>
              </div>
            </div>
          
          

          <div className="blog-table-wrapper">
            <table className="blog-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center" }}>
                      Loading posts...
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan={5} style={{ color: "#b91c1c" }}>
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && posts.map((post) => (
                  <tr key={post.id}>
                    <td className="blog-title-cell">
                      <div className="blog-title-content">
                        <h3 className="blog-post-title">{post.title}</h3>
                        <p className="blog-post-description">{post.description}</p>
                      </div>
                    </td>
                    <td className="blog-author-cell">
                      <span>{post.author}</span>
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
                <label htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  className="blog-edit-input"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                >
                  <option value="General">General</option>
                  <option value="Algorithm Insights">Algorithm Insights</option>
                  <option value="Instagram Growth">Instagram Growth</option>
                  <option value="Content Strategy">Content Strategy</option>
                  <option value="Social Proof">Social Proof</option>
                  <option value="Case Study">Case Study</option>
                  <option value="TikTok Tips">TikTok Tips</option>
                </select>
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

