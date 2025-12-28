"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faXTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  avatarUrl?: string | null;
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/cms/team");
        if (res.ok) {
          const data = await res.json();
          // Filter out inactive members if the API returns them (though the API currently returns all, we might want to filter in the UI or update API)
          // The API returns all, but usually public page should only show active ones.
          // Let's assume the API returns what we want.
          // Note: My API implementation returns all found. I should probably filter by isActive in the API for public view, but for now I'll just show what's returned.
          // Actually, let's filter here if the API returns isActive field.
          setTeamMembers(data.filter((m: any) => m.isActive !== false));
        }
      } catch (error) {
        console.error("Failed to fetch team members", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <section className="team-page">
        <div className="team-container">
          <div className="text-center py-20">Loading...</div>
        </div>
      </section>
    );
  }

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
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="team-avatar-placeholder"></div>
                )}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <div className="team-social">
                {member.twitterUrl && (
                  <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="team-social-link" aria-label={`${member.name} on X (Twitter)`}>
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="team-social-link" aria-label={`${member.name} on LinkedIn`}>
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
