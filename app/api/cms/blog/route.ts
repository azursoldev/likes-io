import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const published = searchParams.get('published') === 'true';

    if (id) {
        const post = await prisma.blogPost.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return NextResponse.json({ post });
    }

    const where: any = {};
    // if (category) where.category = category;
    if (published) {
      where.isPublished = true;
      where.publishedAt = { lte: new Date() };
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Get blog posts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

async function ensureUniqueSlug(slug: string, postId?: string) {
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: uniqueSlug },
    });
    // If no existing post, or existing post is the same one we are updating, it's safe
    if (!existing || (postId && existing.id === postId)) {
      return uniqueSlug;
    }
    // Increment counter and try again
    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      isPublished = false,
      seoMeta,
      metaTitle,
      metaDescription,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Ensure unique slug
    const uniqueSlug = await ensureUniqueSlug(slug);

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: uniqueSlug,
        excerpt,
        content,
        coverImage: featuredImage,
        authorId: session.user.id,
        category,
        metaTitle,
        metaDescription,
        // tags: tags ? (tags as any) : null,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        // seoMeta: seoMeta ? (seoMeta as any) : null,
      },
    });

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('Create blog post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Post id is required' },
        { status: 400 }
      );
    }

    const postId = id; // parseInt(id, 10);
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      isPublished,
      seoMeta,
      publishedAt,
      metaTitle,
      metaDescription
    } = body;

    // Check if slug exists and belongs to another post
    if (slug) {
        const existingPost = await prisma.blogPost.findUnique({
            where: { slug },
        });
        if (existingPost && existingPost.id !== postId) {
            return NextResponse.json(
                { error: 'Slug already exists' },
                { status: 400 }
            );
        }
    }

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: featuredImage,
        category,
        metaTitle,
        metaDescription,
        // tags: tags ? (tags as any) : undefined,
        isPublished,
        publishedAt: typeof publishedAt === 'string' ? new Date(publishedAt) : publishedAt,
        // seoMeta: seoMeta ? (seoMeta as any) : undefined,
      },
    });

    return NextResponse.json({ post: updated });
  } catch (error: any) {
    console.error('Update blog post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Post id is required' },
        { status: 400 }
      );
    }

    const postId = id; // parseInt(id, 10);

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete blog post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

