"use client";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMagnifyingGlass, faUser, faArrowRightFromBracket, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";

type AdminToolbarProps = {
  title: string;
};

export default function AdminToolbar({ title }: AdminToolbarProps) {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = window.location.origin + "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return "AU";
  };

  const userName = session?.user?.name || "Admin User";
  const userRole = session?.user?.role === "ADMIN" ? "Administrator" : "User";
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch("/api/admin/profile/avatar");
        if (res.ok) {
          const data = await res.json();
          if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchAvatar();
    const onUpdated = () => fetchAvatar();
    window.addEventListener("avatar-updated", onUpdated as any);
    return () => {
      window.removeEventListener("avatar-updated", onUpdated as any);
    };
  }, []);

  return (
    <div className="admin-toolbar-wrapper">
      <div className="admin-toolbar-container">
        <div className="admin-toolbar">
          <div className="admin-toolbar-left">
            <h1>{title}</h1>
          </div>
          <div className="admin-toolbar-right">
            <div className="admin-search-pill">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
              <input placeholder="Search..." aria-label="Search" />
            </div>
            <button className="admin-icon-btn" aria-label="Notifications">
              <FontAwesomeIcon icon={faBell} />
            </button>
            <div className="admin-user-chip-wrapper" ref={dropdownRef}>
              <div 
                className="admin-user-chip admin-user-chip-clickable"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={userName} 
                    className="chip-avatar" 
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                  />
                ) : (
                  <div className="chip-avatar">{getUserInitials()}</div>
                )}
                <div className="chip-meta">
                  <span className="chip-name">{userName}</span>
                  <span className="chip-role">{userRole}</span>
                </div>
                <FontAwesomeIcon 
                  icon={faAngleDown} 
                  className={`chip-dropdown-icon ${isDropdownOpen ? "chip-dropdown-icon-open" : ""}`}
                />
              </div>
              {isDropdownOpen && (
                <div className="admin-user-dropdown">
                  <a href="/admin/profile" className="admin-dropdown-item">
                    <FontAwesomeIcon icon={faUser} className="admin-dropdown-icon" />
                    <span>My Profile</span>
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="admin-dropdown-item admin-dropdown-item-logout"
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="admin-dropdown-icon" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

