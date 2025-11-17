export default function FloatingIcons() {
  return (
    <div className="floating-icon-bg" aria-hidden>
      <div className="floating-icon ig-heart" style={{ top: 40, left: 20, animation: "float-1 10s ease-in-out infinite" }}>❤</div>
      <div className="floating-icon ig-user" style={{ top: 160, left: 120, animation: "float-2 12s ease-in-out infinite" }}>👤</div>
      <div className="floating-icon yt-like" style={{ top: 260, left: 60, animation: "float-3 14s ease-in-out infinite" }}>👍</div>
      <div className="floating-icon user" style={{ bottom: 80, right: 60, animation: "float-2 13s ease-in-out infinite" }}>👥</div>
      <div className="floating-icon eye" style={{ bottom: 30, left: 40, animation: "float-1 11s ease-in-out infinite" }}>👁</div>
    </div>
  );
}