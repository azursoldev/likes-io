"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getAllBlogPosts, getFeaturedBlogPost } from "../data/blogPosts";
import type { BlogPost } from "../data/blogPosts";

const BLOG_POSTS = getAllBlogPosts();
const FEATURED_POST = getFeaturedBlogPost() || BLOG_POSTS[0];

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

  const filteredPosts = useMemo(() => {
    let posts = BLOG_POSTS;

    // Filter by category tabs
    if (activeCategory !== "All Posts") {
      posts = posts.filter((post) => post.category === activeCategory);
    }

    // Filter by search query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [activeCategory, searchQuery]);

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
        <section className="blog-section blog-section-featured">
          <Link href={`/blog/${FEATURED_POST.slug}`} className="blog-featured-link">
            <div className="blog-featured">
              <div className="blog-featured-image">
                <div className="blog-featured-image-placeholder">
                  {FEATURED_POST.title}
                </div>
                <div className="blog-featured-overlay">
                  <span className="blog-featured-category">{FEATURED_POST.category}</span>
                  <h2 className="blog-featured-title">{FEATURED_POST.title}</h2>
                </div>
              </div>
              <div className="blog-featured-content">
                <span className="blog-category-badge">{FEATURED_POST.category}</span>
                <h2 className="blog-featured-content-title">{FEATURED_POST.title}</h2>
                <p className="blog-featured-description">{FEATURED_POST.description}</p>
                <div className="blog-author">
                  <div className="blog-author-avatar">
                    {FEATURED_POST.authorAvatar || FEATURED_POST.author.charAt(0)}
                  </div>
                  <div className="blog-author-info">
                    <div className="blog-author-name">{FEATURED_POST.author}</div>
                    <div className="blog-author-meta">
                      {FEATURED_POST.date} - {FEATURED_POST.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

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
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-post-card-link">
                <article className="blog-post-card">
                  <div className="blog-post-image">
                    <div className="blog-post-image-placeholder">
                      {post.title}
                    </div>
                  </div>
                  <div className="blog-post-content">
                    <span className="blog-category-badge">{post.category}</span>
                    <h3 className="blog-post-title">{post.title}</h3>
                    <p className="blog-post-description">{post.description}</p>
                    <div className="blog-author">
                      <div className="blog-author-avatar">
                        {post.authorAvatar || post.author.charAt(0)}
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

