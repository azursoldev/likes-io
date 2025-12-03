import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BlogPostPage from "../../components/BlogPostPage";
import { getBlogPostBySlug, getAllBlogPosts } from "../../data/blogPosts";

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Likes.io Blog",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  return {
    title: `${post.title} | Likes.io Blog`,
    description: post.description,
  };
}

export default function Page({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="page-wrapper">
        <Header />
        <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
          <h1>Post Not Found</h1>
          <p>The blog post you're looking for doesn't exist.</p>
          <a href="/blog" style={{ color: "rgb(249, 115, 22)", textDecoration: "none" }}>
            ← Back to Blog
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Header />
      <BlogPostPage post={post} />
      <Footer />
    </div>
  );
}

