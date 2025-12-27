import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Platform, ServiceType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, review, rating, service } = body;

    // Validate input
    if (!name || !review || !rating || !service) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse service string (e.g., "instagram-likes") to Platform and ServiceType
    let platform: Platform | null = null;
    let serviceType: ServiceType | null = null;
    
    if (service.includes("-")) {
      const parts = service.split("-");
      const platformStr = parts[0].toUpperCase();
      const serviceTypeStr = parts[1].toUpperCase();

      if (platformStr in Platform) {
        platform = platformStr as Platform;
      }
      
      // Map service type string to enum
      // "LIKES" -> ServiceType.LIKES
      // "FOLLOWERS" -> ServiceType.FOLLOWERS
      // "VIEWS" -> ServiceType.VIEWS
      // "SUBSCRIBERS" -> ServiceType.SUBSCRIBERS
      if (serviceTypeStr in ServiceType) {
        serviceType = serviceTypeStr as ServiceType;
      }
    }

    // Create testimonial
    // const testimonial = await prisma.testimonial.create({
    //   data: {
    //     handle: name,
    //     text: review,
    //     rating: Number(rating),
    //     role: "Verified Buyer", // Default role
    //     platform: platform,
    //     serviceType: serviceType,
    //     isApproved: false, // Requires admin approval
    //     isFeatured: false,
    //   },
    // });
    const testimonial = { id: 'mock-id', handle: name, text: review, rating: Number(rating) };

    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const serviceType = searchParams.get("serviceType");
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const where: any = {
      isApproved: true,
    };

    if (platform) {
      where.platform = platform;
    }

    if (serviceType) {
      where.serviceType = serviceType;
    }

    // const reviews = await prisma.testimonial.findMany({
    //   where,
    //   orderBy: {
    //     displayOrder: "asc",
    //   },
    //   take: limit,
    // });
    const reviews: any[] = [];

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
