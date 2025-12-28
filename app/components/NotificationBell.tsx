"use client";
import { useState, useEffect, useRef } from "react";

interface BellNotification {
  id: string;
  title: string;
  description: string;
  icon: string;
  priority: string;
  category: string;
  iconBg: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<BellNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchNotifications();
    
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data: BellNotification[] = await res.json();
        
        // Filter out locally read notifications
        // We need to check localStorage here
        if (typeof window !== "undefined") {
            const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");
            const unread = data.filter(n => !readIds.includes(n.id));
            setNotifications(data);
            setUnreadCount(unread.length);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: string) => {
    if (typeof window !== "undefined") {
        const readIds = JSON.parse(localStorage.getItem("readNotifications") || "[]");
        if (!readIds.includes(id)) {
        const newReadIds = [...readIds, id];
        localStorage.setItem("readNotifications", JSON.stringify(newReadIds));
        setUnreadCount(prev => Math.max(0, prev - 1));
        }
    }
  };

  const handleNotificationClick = (n: BellNotification) => {
    markAsRead(n.id);
  };
  
  const markAllAsRead = () => {
      if (typeof window !== "undefined") {
        const allIds = notifications.map(n => n.id);
        const existingRead = JSON.parse(localStorage.getItem("readNotifications") || "[]");
        const newReadIds = Array.from(new Set([...existingRead, ...allIds]));
        localStorage.setItem("readNotifications", JSON.stringify(newReadIds));
        setUnreadCount(0);
      }
  }

  if (!mounted) {
      // Return the static structure to avoid layout shift if possible, or just null
      // Returning the static bell with 0 badge or empty
      return (
        <div className="notif" aria-label="Notifications">
            <img src="/alarm-2.svg" alt="Notifications" className="icon" width={20} height={20} />
        </div>
      );
  }

  return (
    <div className="notif-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <div 
        className="notif" 
        aria-label="Notifications" 
        onClick={toggleDropdown} 
        style={{ cursor: 'pointer' }}
      >
        <img src="/alarm-2.svg" alt="Notifications" className="icon" width={20} height={20} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="notif-dropdown" style={{
          position: 'absolute',
          top: '140%',
          right: -10,
          width: '320px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#111827' }}>Notifications</span>
            {unreadCount > 0 && (
                <button 
                    onClick={markAllAsRead}
                    style={{ fontSize: '12px', color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                    Mark all read
                </button>
            )}
          </div>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                No notifications
              </div>
            ) : (
              notifications.map((n) => {
                 const isRead = typeof window !== "undefined" && JSON.parse(localStorage.getItem("readNotifications") || "[]").includes(n.id);
                 return (
                <div 
                  key={n.id} 
                  onClick={() => handleNotificationClick(n)}
                  style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid #f3f4f6', 
                    cursor: 'pointer',
                    background: isRead ? 'white' : '#fff7ed', // Orange tint for unread
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isRead ? 'white' : '#fff7ed'}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: n.iconBg || '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      🔔
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: isRead ? 400 : 600, color: '#111827' }}>{n.title}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{n.description}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {!isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316', marginTop: '6px', flexShrink: 0 }} />}
                  </div>
                </div>
              )})
            )}
          </div>
        </div>
      )}
    </div>
  );
}
