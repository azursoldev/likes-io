"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faShare,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { BlogPost } from "../data/blogPosts";
import { useState, useEffect } from "react";

type BlogPostPageProps = {
  post: BlogPost;
};

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!post.sections) return;

      const sections = post.sections.map((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          return {
            id: section.id,
            top: element.getBoundingClientRect().top,
          };
        }
        return null;
      }).filter(Boolean) as Array<{ id: string; top: number }>;

      const current = sections
        .filter((s) => s.top <= 200)
        .sort((a, b) => b.top - a.top)[0];

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [post.sections]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <section className="blog-post-page">
      <div className="container">
        <div className="blog-post-layout">
          {/* Main Content */}
          <article className="blog-post-main">
            {/* Back to Blog */}
            <Link href="/blog" className="blog-post-back">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Blog
            </Link>

            {/* Hero Section */}
            <header className="blog-post-hero">
              <h1 className="blog-post-title">{post.title}</h1>
              <p className="blog-post-subtitle">{post.description}</p>

              {/* Metadata */}
              <div className="blog-post-meta">
                <div className="blog-post-meta-item">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Published on {post.publishedDate || post.date}</span>
                </div>
                <div className="blog-post-meta-item">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Author and Share */}
              <div className="blog-post-author-share">
                <div className="blog-post-author-info">
                  <div className="blog-post-author-avatar">
                    {post.authorAvatar || post.author.charAt(0)}
                  </div>
                  <div className="blog-post-author-details">
                    <div className="blog-post-author-name">By {post.author}</div>
                  </div>
                </div>
                <button className="blog-post-share-btn" onClick={handleShare}>
                  <FontAwesomeIcon icon={faShare} />
                  Share
                </button>
              </div>
            </header>

            {/* Content */}
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="blog-post-sidebar">
            {/* Table of Contents */}
            {post.sections && post.sections.length > 0 && (
              <div className="blog-post-toc">
                <h3 className="blog-post-toc-title">ON THIS PAGE</h3>
                <nav className="blog-post-toc-nav">
                  {post.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`blog-post-toc-link ${
                        activeSection === section.id ? "active" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(section.id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Author Card */}
            <div className="blog-post-author-card">
              <div className="blog-post-author-card-avatar">
                {post.authorAvatar || post.author.charAt(0)}
              </div>
              <h4 className="blog-post-author-card-name">{post.author}</h4>
              {post.authorBio && (
                <p className="blog-post-author-card-bio">{post.authorBio}</p>
              )}
              <div className="blog-post-author-card-actions">
                <Link href="/blog" className="blog-post-author-card-link">
                  Read More
                </Link>
                <button
                  className="blog-post-author-card-link"
                  onClick={handleShare}
                >
                  Share
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

