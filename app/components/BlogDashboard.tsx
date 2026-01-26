"use client";
import { useState, useEffect, useRef } from "react";
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

type TeamMember = {
  id: string;
  name: string;
};

export default function BlogDashboard() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogRow | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    category: "General",
    publishDate: "",
    published: false,
    metaTitle: "",
    metaDescription: "",
  });
  const quillEditorRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<any>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load team members if not already loaded
      if (teamMembers.length === 0) {
        const teamRes = await fetch("/api/cms/team");
        if (teamRes.ok) {
          const members = await teamRes.json();
          setTeamMembers(members);
        }
      }

      const res = await fetch("/api/cms/blog");
      if (!res.ok) throw new Error("Failed to load blog posts");
      const data = await res.json();
      const rows: BlogRow[] = (data.posts || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.excerpt || "",
        author: p.teamMember?.name || p.author?.name || p.author?.email || "Unknown",
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

  useEffect(() => {
    if (!showEditModal) {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.off("text-change");
        quillInstanceRef.current = null;
      }
      return;
    }
    if (!quillEditorRef.current) return;
    const loadQuill = async () => {
      if (typeof window === "undefined") return;
      const w = window as any;
      if (!w.Quill) {
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.getElementById("quill-cdn-script");
          if (existingScript) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.id = "quill-cdn-script";
          script.src = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Quill"));
          document.body.appendChild(script);
        });
        const existingLink = document.getElementById("quill-snow-style");
        if (!existingLink) {
          const link = document.createElement("link");
          link.id = "quill-snow-style";
          link.rel = "stylesheet";
          link.href = "https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css";
          document.head.appendChild(link);
        }
      }
      if (!quillEditorRef.current) return;
      const QuillCtor = (window as any).Quill;
      if (!QuillCtor) return;
      const toolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        ["link", "image", "video", "formula"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
      ];
      const initialContent =
        editForm.content && editForm.content.trim().length > 0
          ? editForm.content
          : "<h2>Demo Content</h2><p>Preset build with <code>snow</code> theme, and some common formats.</p>";
      if (quillInstanceRef.current) {
        quillInstanceRef.current.root.innerHTML = initialContent;
        return;
      }
      const quill = new QuillCtor(quillEditorRef.current, {
        modules: {
          toolbar: toolbarOptions,
        },
        theme: "snow",
      });
      quill.root.innerHTML = initialContent;
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        setEditForm((prev) => ({ ...prev, content: html }));
      });
      quillInstanceRef.current = quill;
    };
    loadQuill().catch((error) => {
      console.error("Failed to initialize Quill editor:", error);
    });
  }, [showEditModal]);

  const handleToggleStatus = (id: number) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, status: !post.status } : post
      )
    );
  };

  const handleEdit = async (id: number) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setSelectedPost(post);
      try {
        const res = await fetch(`/api/cms/blog?id=${id}`);
        const data = await res.json();
        const fullPost = data.post;

        if (fullPost) {
          setEditForm({
            title: fullPost.title,
            slug: fullPost.slug || "",
            excerpt: fullPost.excerpt || "",
            content: fullPost.content || "",
            featuredImageUrl: fullPost.coverImage || "",
            category: fullPost.category || "General",
            publishDate: fullPost.publishedAt ? new Date(fullPost.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            published: fullPost.isPublished,
            metaTitle: fullPost.metaTitle || "",
            metaDescription: fullPost.metaDescription || "",
            teamMemberId: fullPost.teamMemberId || "",
          });
          setFeaturedImageFile(null);
          setShowEditModal(true);
        }
      } catch (err) {
        console.error("Failed to fetch post details", err);
        // Fallback to basic info if fetch fails
        setEditForm({
          title: post.title,
          slug: "",
          excerpt: post.description,
          content: "",
          featuredImageUrl: "",
          category: post.category || "General",
          publishDate: typeof post.date === 'string' ? post.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
          published: post.status,
          metaTitle: "",
          metaDescription: "",
          teamMemberId: "",
        });
        setShowEditModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedPost(null);
    setEditForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImageUrl: "",
      category: "General",
      publishDate: "",
      published: false,
      metaTitle: "",
      metaDescription: "",
      teamMemberId: "",
    });
    setFeaturedImageFile(null);
  };

  const handleSavePost = async () => {
    try {
      setError(null);
      
      let imageUrl = editForm.featuredImageUrl;
      if (featuredImageFile) {
        const formData = new FormData();
        formData.append('file', featuredImageFile);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
           throw new Error("Failed to upload image");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url || uploadData.publicUrl;
      }

      // Create NEW post when no post is selected
      if (!selectedPost) {
        const slug = editForm.slug || editForm.title
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
            featuredImage: imageUrl || null,
            category: editForm.category || null,
            tags: null,
            isPublished: editForm.published,
            seoMeta: null,
            metaTitle: editForm.metaTitle,
            metaDescription: editForm.metaDescription,
            teamMemberId: editForm.teamMemberId || null,
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
          slug: editForm.slug,
          excerpt: editForm.excerpt,
          content: editForm.content,
          featuredImage: imageUrl || null,
          category: editForm.category || null,
          tags: null,
          isPublished: editForm.published,
          publishedAt: editForm.publishDate || null,
          seoMeta: null,
          metaTitle: editForm.metaTitle,
          metaDescription: editForm.metaDescription,
          teamMemberId: editForm.teamMemberId || null,
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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
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
                      slug: "",
                      excerpt: "",
                      content: "",
                      featuredImageUrl: "",
                      category: "General",
                      publishDate: new Date().toISOString().slice(0, 10),
                      published: false,
                      metaTitle: "",
                      metaDescription: "",
                      teamMemberId: "",
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
                <label htmlFor="edit-slug">Slug (URL)</label>
                <input
                  type="text"
                  id="edit-slug"
                  className="blog-edit-input"
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  placeholder="custom-url-slug"
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
                <label htmlFor="edit-author">Author</label>
                <select
                  id="edit-author"
                  className="blog-edit-input"
                  value={editForm.teamMemberId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, teamMemberId: e.target.value })
                  }
                >
                  <option value="">Admin (Default)</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
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
                <div
                  id="editor"
                  className="blog-edit-textarea blog-edit-content-textarea"
                  ref={quillEditorRef}
                  style={{ minHeight: "300px" }}
                />
              </div>

              <div className="blog-edit-form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Featured Image</label>
                
                {/* Preview Area */}
                {(editForm.featuredImageUrl || featuredImageFile) && (
                  <div style={{ marginBottom: '15px', position: 'relative', width: 'fit-content' }}>
                    <img 
                      src={editForm.featuredImageUrl} 
                      alt="Featured Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({ ...editForm, featuredImageUrl: "" });
                        setFeaturedImageFile(null);
                      }}
                      style={{
                        position: 'absolute', top: '-10px', right: '-10px',
                        background: '#ef4444', color: 'white',
                        border: '2px solid white', borderRadius: '50%', width: '28px', height: '28px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      title="Remove Image"
                    >
                      <FontAwesomeIcon icon={faTimes} size="sm" />
                    </button>
                  </div>
                )}

                {/* Upload Control */}
                <div 
                     style={{ 
                        border: '2px dashed #e5e7eb', 
                        padding: '30px', 
                        borderRadius: '8px', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        backgroundColor: '#f9fafb',
                        transition: 'border-color 0.2s'
                     }}
                     onMouseOver={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                     onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                     onClick={() => document.getElementById('featured-image-upload')?.click()}
                >
                  <input
                    type="file"
                    id="featured-image-upload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFeaturedImageFile(e.target.files[0]);
                        const url = URL.createObjectURL(e.target.files[0]);
                        setEditForm({ ...editForm, featuredImageUrl: url });
                      }
                    }}
                  />
                  <div style={{ marginBottom: '8px' }}>
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '24px', color: '#9ca3af' }} />
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '0.95rem', fontWeight: '500' }}>
                    Click to upload image
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '4px' }}>
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </div>
                </div>

                {/* URL Fallback */}
                <div style={{ marginTop: '15px' }}>
                  <details>
                    <summary style={{ fontSize: '0.85rem', color: '#6b7280', cursor: 'pointer', userSelect: 'none' }}>Or use image URL</summary>
                    <input
                      type="text"
                      className="blog-edit-input"
                      style={{ marginTop: '8px' }}
                      value={editForm.featuredImageUrl}
                      onChange={(e) => {
                        setEditForm({ ...editForm, featuredImageUrl: e.target.value });
                        setFeaturedImageFile(null); 
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                  </details>
                </div>
              </div>

              <div className="blog-edit-form-group">
                <label style={{ fontWeight: 'bold', marginTop: '20px', display: 'block', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>SEO Settings</label>
                <label htmlFor="edit-meta-title" style={{ fontSize: '0.9rem' }}>Meta Title</label>
                <input
                  type="text"
                  id="edit-meta-title"
                  className="blog-edit-input"
                  value={editForm.metaTitle}
                  onChange={(e) => setEditForm({ ...editForm, metaTitle: e.target.value })}
                  placeholder="SEO Title (defaults to post title)"
                />
              </div>

              <div className="blog-edit-form-group">
                <label htmlFor="edit-meta-desc" style={{ fontSize: '0.9rem' }}>Meta Description</label>
                <textarea
                  id="edit-meta-desc"
                  className="blog-edit-textarea"
                  rows={2}
                  value={editForm.metaDescription}
                  onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })}
                  placeholder="SEO Description (150-160 characters)"
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
              {editForm.slug && (
                  <a 
                    href={`/blog/${editForm.slug}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="blog-edit-btn"
                    style={{ marginRight: 'auto', backgroundColor: '#6366f1', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                      Preview Post
                  </a>
              )}
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

