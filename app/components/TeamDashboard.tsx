"use client";
import "../dashboard/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
};

const initialTeam: TeamMember[] = [
  {
    id: 1,
    name: "Olivia Chen",
    role: "Founder & CEO",
    bio: "Olivia is the visionary behind Likes.io, with a passion for helping creators build authentic audiences.",
  },
  {
    id: 2,
    name: "Benjamin Carter",
    role: "Head of Technology",
    bio: "With over a decade in software engineering, Ben architects the secure and scalable systems powering Likes.io.",
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    role: "Director of Customer Experience",
    bio: "Sophia and her team are dedicated to providing world-class, 24/7 support. She believes in making every interaction delightful.",
  },
  {
    id: 4,
    name: "Liam Goldberg",
    role: "Marketing & Growth Strategist",
    bio: "Liam is an expert in social media trends and growth hacking, crafting the strategies that keep Likes.io ahead.",
  },
  {
    id: 5,
    name: "Ava Nguyen",
    role: "Lead Product Designer",
    bio: "Ava crafts the intuitive and seamless user experiences you see on our platform. She ensures every detail feels polished.",
  },
  {
    id: 6,
    name: "Noah Kim",
    role: "Data Analyst",
    bio: "Noah analyzes market data to refine our services and ensure we provide the highest quality engagement possible.",
  },
];

export default function TeamDashboard() {
  const [members, setMembers] = useState<TeamMember[]>(initialTeam);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const resetForm = () => {
    setName("");
    setRole("");
    setBio("");
    setEditingId(null);
    setAvatar("");
    setTwitterUrl("");
    setInstagramUrl("");
    setLinkedinUrl("");
  };

  const handleSave = () => {
    if (!name.trim() || !role.trim() || !bio.trim()) return;
    if (editingId !== null) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? {
                ...m,
                name: name.trim(),
                role: role.trim(),
                bio: bio.trim(),
                avatar: avatar.trim(),
                twitterUrl: twitterUrl.trim(),
                instagramUrl: instagramUrl.trim(),
                linkedinUrl: linkedinUrl.trim(),
              }
            : m
        )
      );
    } else {
      const next: TeamMember = {
        id: Date.now(),
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        avatar: avatar.trim(),
        twitterUrl: twitterUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
      };
      setMembers((prev) => [...prev, next]);
    }
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setBio(member.bio);
    setAvatar(member.avatar || "");
    setTwitterUrl(member.twitterUrl || "");
    setInstagramUrl(member.instagramUrl || "");
    setLinkedinUrl(member.linkedinUrl || "");
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this team member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="team" />

        <main className="admin-main">
          <AdminToolbar title="Team Members" />
          <div className="admin-content">
            <div className="team-page-header">
              <div className="team-header-text">
                <h2>Team Members</h2>
                <p>Manage the team profiles shown on the 'Our Team' page.</p>
              </div>
              <div className="team-header-actions">
                <button className="team-add-btn" onClick={() => setShowModal(true)}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Team Member</span>
                </button>
              </div>
            </div>

            <div className="team-table-card">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th>Bio</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="team-member-cell">
                          <div className="team-avatar">👤</div>
                          <span className="team-name">{member.name}</span>
                        </div>
                      </td>
                      <td>{member.role}</td>
                      <td>{member.bio}</td>
                      <td className="team-actions">
                        <button className="team-edit" onClick={() => handleEdit(member)}>
                          Edit
                        </button>
                        <button className="team-delete" onClick={() => handleDelete(member.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="faq-modal-backdrop">
          <div className="faq-modal">
            <div className="faq-modal-header">
              <h3>{editingId !== null ? "Edit Team Member" : "Add Team Member"}</h3>
              <button
                className="faq-modal-close"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="faq-modal-body">
              <div className="modal-row two-col">
                <label className="faq-modal-label">
                  Name
                  <input
                    className="faq-modal-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                  />
                </label>
                <label className="faq-modal-label">
                  Role
                  <input
                    className="faq-modal-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Role / Title"
                  />
                </label>
              </div>

              <label className="faq-modal-label">
                Avatar URL
                <input
                  className="faq-modal-input"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label className="faq-modal-label">
                Bio
                <textarea
                  className="faq-modal-textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short bio"
                  rows={5}
                />
              </label>

              <div className="modal-row three-col">
                <label className="faq-modal-label">
                  Twitter URL
                  <input
                    className="faq-modal-input"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </label>
                <label className="faq-modal-label">
                  Instagram URL
                  <input
                    className="faq-modal-input"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </label>
                <label className="faq-modal-label">
                  LinkedIn URL
                  <input
                    className="faq-modal-input"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </label>
              </div>
            </div>
            <div className="faq-modal-footer">
              <button
                className="faq-modal-cancel"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="faq-modal-save"
                onClick={handleSave}
                disabled={!name.trim() || !role.trim() || !bio.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

