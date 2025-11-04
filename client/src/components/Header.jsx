import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    // Fetch user info to check if admin
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  async function fetchUserInfo(token) {
    try {
      const res = await axios.get("http://localhost:5000/user/role", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming your dashboard returns user info with role
      if (res.data && res.data.role === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setIsAdmin(false);
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
            {isAdmin && (
              <Link to="/companies" className="nav-link">
                Companies
              </Link>
            )}
            <button className="nav-link logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <button className="nav-link logout-btn" onClick={() => navigate("/profile")}>
            👤
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
