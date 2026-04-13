import { Bookmark, Home, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/health`,
          { signal: AbortSignal.timeout(3000) },
        );
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };

    checkBackend();
  }, []);
  return (
    <header>
      <div className="header-logo-group">
        <img
          src="/favIcon.png"
          alt="JobRadar Logo"
          width={40}
          height={40}
          className="logo-img"
        />
        <div className="logo-text">
          <div className="logo">
            Job<span>Radar</span>
          </div>
          <div className="logo-sub">AI-powered job matcher</div>
        </div>
      </div>

      <div className="status-dot">
        <div className={`dot ${!isOnline ? "offline" : ""}`} />
        <span>
          {isOnline ? "backend online" : "backend offline – start server first"}
        </span>
        <button className="menu-button" onClick={() => handleMenu()}>
          <Menu />
        </button>
      </div>
      {showMenu && (
        <div className="dropdown-menu">
          <Link to="/" className="dropdown-item">
            <Home /> Home
          </Link>
          <Link to="/bookmarks" className="dropdown-item">
            <Bookmark /> Bookmarks
          </Link>
          <Link to="/profile" className="dropdown-item">
            <User /> Profile
          </Link>
        </div>
      )}
    </header>
  );
};
