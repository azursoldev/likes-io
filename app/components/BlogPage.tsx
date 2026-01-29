"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

type UiBlogPost = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  image?: string;
};

const CATEGORIES = [
  "All Posts",
  "Algorithm Insights",
  "Instagram Growth",
  "Content Strategy",
  "Social Proof",
  "Case Study",
  "TikTok Tips",
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [posts, setPosts] = useState<UiBlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<UiBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== debouncedSearch) {
        setDebouncedSearch(searchQuery);
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearch]);

  const handleCategoryChange = (category: string) => {
    if (activeCategory !== category) {
      setActiveCategory(category);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append("published", "true");
        params.append("page", currentPage.toString());
        params.append("limit", "6");
        
        if (activeCategory !== "All Posts") {
          params.append("category", activeCategory);
        }
        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        const res = await fetch(`/api/cms/blog?${params.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to load blog posts");
        }
        const data = await res.json();
        
        const mapped: UiBlogPost[] = (data.posts || []).map((p: any) => {
          const dt = p.publishedAt ? new Date(p.publishedAt) : new Date();
          const authorName = p.teamMember?.name || p.author?.name || p.author?.email || "Likes.io Team";
          
          let authorAvatarUrl = "";
          let authorInitial = "L";
          
          if (p.teamMember?.avatarUrl) {
            authorAvatarUrl = p.teamMember.avatarUrl;
          } else if (p.author?.avatarUrl) {
            authorAvatarUrl = p.author.avatarUrl;
          } else {
            authorInitial = (authorName || "L").charAt(0).toUpperCase();
          }

          return {
            id: String(p.id),
            slug: p.slug,
            category: p.category || "Blog",
            title: p.title,
            description: p.excerpt || "",
            author: authorName,
            authorAvatar: authorAvatarUrl || authorInitial,
            date: dt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            readTime: "5 min read",
            image: p.coverImage || "",
          };
        });
        
        setPosts(mapped);
        setFeaturedPost(mapped[0] ?? null);
        if (data.pagination) {
            setTotalPages(data.pagination.totalPages);
        }
      } catch (err: any) {
        console.error("Blog page load error", err);
        setError(err.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [currentPage, activeCategory, debouncedSearch]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="blog-page">
      <div className="blog-container">
        {/* Hero Section */}
        <section className="blog-hero-section">
          <h1 className="blog-title">Likes.io Blog</h1>
          <p className="blog-subtitle">
            The latest news, strategies, and insights to help you master your social media growth.
          </p>
        </section>

        {/* Section 1: Featured Article */}
        {featuredPost && (
          <section className="blog-section blog-section-featured">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="blog-featured-link"
            >
              <div className="blog-featured">
                <div className="blog-featured-image">
                  {featuredPost.image ? (
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        objectPosition: 'center'
                      }} 
                    />
                  ) : (
                    <div className="blog-featured-image-placeholder">
                      {featuredPost.title}
                    </div>
                  )}
                  <div className="blog-featured-overlay">
                    <span className="blog-featured-category">
                      {featuredPost.category}
                    </span>
                    <h2 className="blog-featured-title">
                      {featuredPost.title}
                    </h2>
                  </div>
                </div>
                <div className="blog-featured-content">
                  <span className="blog-category-badge">
                    {featuredPost.category}
                  </span>
                  <h2 className="blog-featured-content-title">
                    {featuredPost.title}
                  </h2>
                  <p className="blog-featured-description">
                    {featuredPost.description}
                  </p>
                  <div className="blog-author">
                    <div className="blog-author-avatar" style={{ overflow: "hidden" }}>
                      {featuredPost.authorAvatar && (featuredPost.authorAvatar.startsWith('/') || featuredPost.authorAvatar.startsWith('http')) ? (
                          <img 
                            src={featuredPost.authorAvatar} 
                            alt={featuredPost.author} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                      ) : (
                          featuredPost.authorAvatar || featuredPost.author.charAt(0)
                      )}
                    </div>
                    <div className="blog-author-info">
                      <div className="blog-author-name">
                        {featuredPost.author}
                      </div>
                      <div className="blog-author-meta">
                        {featuredPost.date} - {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Section 2: All Blog Posts */}
        <section className="blog-section blog-section-posts">
          {/* Search and Filters */}
          <div className="blog-search-section">
            <div className="blog-search-wrapper">
              <FontAwesomeIcon icon={faSearch} className="blog-search-icon" />
              <input
                type="text"
                className="blog-search-input"
                placeholder="Search for articles (e.g. 'algorithm')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="blog-filters">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={`blog-filter-btn ${activeCategory === category ? "active" : ""}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="blog-posts-grid">
            {loading && (
              <p style={{ gridColumn: "1 / -1" }}>Loading blog posts...</p>
            )}
            {error && !loading && (
              <p style={{ gridColumn: "1 / -1", color: "#b91c1c" }}>{error}</p>
            )}
            {!loading &&
              !error &&
              posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-post-card-link">
                <article className="blog-post-card">
                  <div className="blog-post-image">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          objectPosition: 'center'
                        }} 
                      />
                    ) : (
                      <div className="blog-post-image-placeholder">
                        {post.title}
                      </div>
                    )}
                  </div>
                  <div className="blog-post-content">
                    <span className="blog-category-badge">{post.category}</span>
                    <h3 className="blog-post-title">{post.title}</h3>
                    <p className="blog-post-description">{post.description}</p>
                    <div className="blog-author">
                      <div className="blog-author-avatar" style={{ overflow: "hidden" }}>
                        {post.authorAvatar && (post.authorAvatar.startsWith('/') || post.authorAvatar.startsWith('http')) ? (
                            <img 
                              src={post.authorAvatar} 
                              alt={post.author} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            post.authorAvatar || post.author.charAt(0)
                        )}
                      </div>
                      <div className="blog-author-info">
                        <div className="blog-author-name">{post.author}</div>
                        <div className="blog-author-meta">
                          {post.date} - {post.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="blog-pagination" style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", gap: "10px", marginTop: "40px", alignItems: "center" }}>
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                  style={{ 
                    padding: "10px 15px", 
                    borderRadius: "8px", 
                    border: "1px solid #e5e7eb",
                    background: currentPage === 1 ? "#f3f4f6" : "#fff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    color: currentPage === 1 ? "#9ca3af" : "#111827",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "500"
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} /> Previous
                </button>
                
                <span style={{ margin: "0 10px", fontWeight: "600", color: "#374151" }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                   style={{ 
                    padding: "10px 15px", 
                    borderRadius: "8px", 
                    border: "1px solid #e5e7eb",
                    background: currentPage === totalPages ? "#f3f4f6" : "#fff",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    color: currentPage === totalPages ? "#9ca3af" : "#111827",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "500"
                  }}
                >
                  Next <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
