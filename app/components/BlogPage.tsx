"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [posts, setPosts] = useState<UiBlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<UiBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/cms/blog?published=true");
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
      } catch (err: any) {
        console.error("Blog page load error", err);
        setError(err.message || "Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const filteredPosts = useMemo(() => {
    let list = posts;

    // Filter by category tabs
    if (activeCategory !== "All Posts") {
      list = list.filter((post) => post.category === activeCategory);
    }

    // Filter by search query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      );
    }

    return list;
  }, [posts, activeCategory, searchQuery]);

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
                  onClick={() => setActiveCategory(category)}
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
              filteredPosts.map((post) => (
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
          </div>
        </section>
      </div>
    </div>
  );
}

