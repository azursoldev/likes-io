import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = params;

    // Use Prisma model
    const legalPage = await prisma.legalPage.findUnique({
      where: { slug },
    });
    
    // const result: any[] = await prisma.$queryRaw`
    //   SELECT * FROM "legal_pages" WHERE "slug" = ${slug} LIMIT 1
    // `;
    
    // const legalPage = result[0];

    if (!legalPage) {
      // Return defaults if not found in DB
      if (slug === "terms") {
        const { TERMS_DEFAULT_SECTIONS } = await import("@/lib/legal-defaults");
        return NextResponse.json({
          slug: "terms",
          title: "Terms of Service",
          sections: TERMS_DEFAULT_SECTIONS
        });
      } else if (slug === "privacy") {
        const { PRIVACY_DEFAULT_SECTIONS } = await import("@/lib/legal-defaults");
        return NextResponse.json({
          slug: "privacy",
          title: "Privacy Policy",
          sections: PRIVACY_DEFAULT_SECTIONS
        });
      }
      return NextResponse.json({ sections: [] });
    }

    return NextResponse.json(legalPage);
  } catch (error: any) {
    console.error("Get legal page error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch legal page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = params;
    const body = await request.json();
    const { title, sections } = body;

    const sectionsJson = JSON.stringify(sections);
    const now = new Date().toISOString();
    const id = `lp_${Date.now()}`; // Simple ID generation

    // Upsert using Prisma model
    await prisma.legalPage.upsert({
      where: { slug },
      update: {
        title,
        sections,
      },
      create: {
        slug,
        title,
        sections,
      },
    });

    // Revalidate the public page
    revalidatePath(`/${slug}`);

    // await prisma.$executeRaw`
    //   INSERT INTO "legal_pages" ("id", "slug", "title", "sections", "updatedAt")
    //   VALUES (${id}, ${slug}, ${title}, ${sectionsJson}::jsonb, ${now}::timestamp)
    //   ON CONFLICT ("slug") 
    //   DO UPDATE SET 
    //     "title" = ${title},
    //     "sections" = ${sectionsJson}::jsonb,
    //     "updatedAt" = ${now}::timestamp
    // `;

    return NextResponse.json({ slug, title, sections });
  } catch (error: any) {
    console.error("Update legal page error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update legal page" },
      { status: 500 }
    );
  }
}
