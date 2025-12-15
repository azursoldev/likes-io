import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BlogPostPage from "../../components/BlogPostPage";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });
  
  if (!post) {
    return {
      title: "Post Not Found | Likes.io Blog",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  return {
    title: `${post.title} | Likes.io Blog`,
    description: post.excerpt || "", 
  };
}

export default function Page({ params }: Props) {
  return (
    <div className="page-wrapper">
      <Header />
      {/* Client component will fetch and render the post dynamically by slug */}
      <BlogPostPage slug={params.slug} />
      <Footer />
    </div>
  );
}

