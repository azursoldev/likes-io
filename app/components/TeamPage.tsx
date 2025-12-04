"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  social: {
    twitter?: boolean;
    linkedin?: boolean;
  };
};

const teamMembers: TeamMember[] = [
  {
    name: "Olivia Chen",
    role: "Founder & CEO",
    description: "Olivia founded Likes.io with a vision to democratize social media growth. With over 12 years of experience in digital marketing and entrepreneurship, she leads our strategic direction and ensures we stay ahead of industry trends.",
    social: {
      twitter: true,
      linkedin: true,
    },
  },
  {
    name: "Benjamin Carter",
    role: "Head of Technology",
    description: "Benjamin oversees our technical infrastructure and platform development. His expertise in scalable systems and automation ensures our services deliver reliably at scale, handling millions of interactions seamlessly.",
    social: {
      linkedin: true,
    },
  },
  {
    name: "Sophia Rodriguez",
    role: "Director of Customer Experience",
    description: "Sophia is passionate about creating exceptional customer journeys. She manages our global support team and continuously improves our service quality based on customer feedback and industry best practices.",
    social: {
      twitter: true,
    },
  },
  {
    name: "Liam Goldberg",
    role: "Marketing & Growth Strategist",
    description: "Liam drives our growth initiatives and brand positioning. With a deep understanding of social media algorithms and user behavior, he develops strategies that help our clients achieve sustainable, organic growth.",
    social: {
      twitter: true,
      linkedin: true,
    },
  },
  {
    name: "Ava Nguyen",
    role: "Lead Product Designer",
    description: "Ava designs intuitive user experiences that make our platform accessible to everyone. Her focus on user-centered design ensures our tools are both powerful and easy to use, regardless of technical expertise.",
    social: {
      linkedin: true,
    },
  },
  {
    name: "Noah Kim",
    role: "Data Analyst",
    description: "Noah analyzes performance metrics and market trends to inform our product decisions. His data-driven insights help us optimize delivery speeds, improve service quality, and identify emerging opportunities.",
    social: {
      linkedin: true,
    },
  },
];

export default function TeamPage() {
  return (
    <section className="team-page">
      <div className="team-container">
        {/* Hero Section */}
        <section className="blog-hero-section">
          <h1 className="blog-title">Meet Our Team</h1>
          <p className="blog-subtitle">
            We're a passionate group of strategists, engineers, and creatives dedicated to helping you succeed in the digital world.
          </p>
        </section>
        <div className="team-grid-container">
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar">
                <div className="team-avatar-placeholder"></div>
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <div className="team-social">
                {member.social.twitter && (
                  <a href="#" className="team-social-link" aria-label={`${member.name} on X (Twitter)`}>
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                )}
                {member.social.linkedin && (
                  <a href="#" className="team-social-link" aria-label={`${member.name} on LinkedIn`}>
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                )}
              </div>
              <p className="team-description">{member.description}</p>
              <a href="#" className="team-profile-btn">
                View Profile & Posts <FontAwesomeIcon icon={faAngleRight} />
              </a>
            </div>
          ))}
        </div>
        </div>
       
      </div>
    </section>
  );
}

