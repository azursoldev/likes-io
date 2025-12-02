"use client";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type BlogPost = {
  id: string;
  category: string;
  categoryColor?: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  imageUrl?: string;
  featured?: boolean;
};

const FEATURED_POST: BlogPost = {
  id: "1",
  category: "DEEP DIVE",
  title: "The 2024 Instagram Algorithm: A Deep Dive for Creators",
  description: "Tired of guessing what works? We're pulling back the curtain on the Instagram algorithm. Learn about the key ranking signals for Reels, Stories, and the feed to maximize your reach.",
  author: "Olivia Chen",
  authorAvatar: "Olivia",
  date: "September 5, 2024",
  readTime: "8 min read",
  featured: true,
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: "2",
    category: "Content Strategy",
    title: "5 Content Pillars Every Successful Brand Needs on Instagram",
    description: "Stop posting randomly. Discover how to build a powerful content strategy around 5 key pillars that will attract, engage, and convert your target audience.",
    author: "Benjamin Carter",
    authorAvatar: "BC",
    date: "September 2, 2024",
    readTime: "6 min read",
  },
  {
    id: "3",
    category: "Growth Hacking",
    title: "Beyond the Follower Count: The Real Power of Social Proof",
    description: "Why does social proof matter more than ever? Learn the psychology behind it and how to leverage likes and views to build trust and credibility with new visitors.",
    author: "Sophia Rodriguez",
    authorAvatar: "SR",
    date: "August 28, 2024",
    readTime: "5 min read",
  },
  {
    id: "4",
    category: "Case Study",
    title: "From 1k to 50k Followers in 90 Days: A Likes.io Case Study",
    description: "We break down the exact strategy a small e-commerce brand used, combining our services with organic tactics, to achieve explosive growth and a 200% increase in sales.",
    author: "Liam Goldberg",
    authorAvatar: "LG",
    date: "August 21, 2024",
    readTime: "7 min read",
  },
  {
    id: "5",
    category: "Profile Tips",
    title: "Is Your Instagram Bio Costing You Followers? How to Fix It.",
    description: "Your bio is your brand's elevator pitch. We provide a simple, effective template and tips to optimize your bio for maximum impact and follower conversion.",
    author: "Ava Nguyen",
    authorAvatar: "AN",
    date: "August 15, 2024",
    readTime: "4 min read",
  },
  {
    id: "6",
    category: "Platform Analysis",
    title: "TikTok vs. Instagram Reels: Where Should You Focus in 2024?",
    description: "The ultimate showdown. We analyze the pros, cons, and key audience differences between TikTok and Reels to help you decide where to invest your creative energy.",
    author: "Sophia Rodriguez",
    authorAvatar: "SR",
    date: "August 11, 2024",
    readTime: "6 min read",
  },
  {
    id: "7",
    category: "Security",
    title: "The Technical Side of Trust: Why Our Service is Safe",
    description: "Go behind the scenes with our Head of Technology to understand the secure methods we use to deliver engagement, ensuring your account's safety is always the top priority.",
    author: "Noah Kim",
    authorAvatar: "NK",
    date: "August 2, 2024",
    readTime: "5 min read",
  },
];

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
              <article key={post.id} className="blog-post-card">
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

