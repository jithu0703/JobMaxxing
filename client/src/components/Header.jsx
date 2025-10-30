import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header__brand">
        <Link to="/" className="brand-link">
          <span className="brand-accent">Velai</span>
          <span className="brand-main">-Vaaippu</span>
        </Link>
      </div>
      <nav className="header__nav">
        <Link to="/jobs" className="nav-link">
          Jobs
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <button className="nav-link logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
