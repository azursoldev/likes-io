import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const defaultTeamMembers = [
  {
    name: "Olivia Chen",
    role: "Founder & CEO",
    description: "Olivia founded Likes.io with a vision to democratize social media growth. With over 12 years of experience in digital marketing and entrepreneurship, she leads our strategic direction and ensures we stay ahead of industry trends.",
    twitterUrl: "https://twitter.com",
    linkedinUrl: "https://linkedin.com",
    displayOrder: 1,
  },
  {
    name: "Benjamin Carter",
    role: "Head of Technology",
    description: "Benjamin oversees our technical infrastructure and platform development. His expertise in scalable systems and automation ensures our services deliver reliably at scale, handling millions of interactions seamlessly.",
    linkedinUrl: "https://linkedin.com",
    displayOrder: 2,
  },
  {
    name: "Sophia Rodriguez",
    role: "Director of Customer Experience",
    description: "Sophia is passionate about creating exceptional customer journeys. She manages our global support team and continuously improves our service quality based on customer feedback and industry best practices.",
    twitterUrl: "https://twitter.com",
    displayOrder: 3,
  },
  {
    name: "Liam Goldberg",
    role: "Marketing & Growth Strategist",
    description: "Liam drives our growth initiatives and brand positioning. With a deep understanding of social media algorithms and user behavior, he develops strategies that help our clients achieve sustainable, organic growth.",
    twitterUrl: "https://twitter.com",
    linkedinUrl: "https://linkedin.com",
    displayOrder: 4,
  },
  {
    name: "Ava Nguyen",
    role: "Lead Product Designer",
    description: "Ava designs intuitive user experiences that make our platform accessible to everyone. Her focus on user-centered design ensures our tools are both powerful and easy to use, regardless of technical expertise.",
    linkedinUrl: "https://linkedin.com",
    displayOrder: 5,
  },
  {
    name: "Noah Kim",
    role: "Data Analyst",
    description: "Noah analyzes performance metrics and market trends to inform our product decisions. His data-driven insights help us optimize delivery speeds, improve service quality, and identify emerging opportunities.",
    linkedinUrl: "https://linkedin.com",
    displayOrder: 6,
  },
];

export async function GET() {
  try {
    const count = await prisma.teamMember.count();
    
    if (count === 0) {
      // Seed default data
      await prisma.teamMember.createMany({
        data: defaultTeamMembers,
      });
    }

    const members = await prisma.teamMember.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, description, twitterUrl, linkedinUrl, avatarUrl, displayOrder, isActive } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and Role are required" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        description: description || "",
        twitterUrl,
        linkedinUrl,
        avatarUrl,
        displayOrder: displayOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
