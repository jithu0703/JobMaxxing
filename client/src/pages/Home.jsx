import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Home.css";

function Home() {
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
    <div className="home-container">
      <div className="home-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome to <span className="brand-name">Velai-Vaaippu</span>
          </h1>
          <p className="hero-subtitle">
            Your one-stop portal for discovering job opportunities from multiple sources
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <span>Smart Search</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Real-time Updates</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Multiple Sources</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <Link to="/jobs" className="btn btn-primary btn-large">
            <span className="btn-icon">🔍</span>
            Browse Jobs
          </Link>

          <div className="secondary-actions">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="btn btn-secondary">
                  Dashboard
                </Link>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-outline">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-icon">💼</div>
            <h3 className="info-card-title">Diverse Opportunities</h3>
            <p className="info-card-description">
              Access jobs from multiple platforms in one place
            </p>
          </div>
          <div className="info-card">
            <div className="info-card-icon">⏱️</div>
            <h3 className="info-card-title">Save Time</h3>
            <p className="info-card-description">
              No need to visit multiple job portals separately
            </p>
          </div>
          <div className="info-card">
            <div className="info-card-icon">📊</div>
            <h3 className="info-card-title">Track Applications</h3>
            <p className="info-card-description">
              Keep track of all your job applications in one dashboard
            </p>
          </div>
        </div>

        {/* Quick Stats (Optional - for future) */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Companies</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5+</div>
            <div className="stat-label">Job Sources</div>
          </div>
        </div>
      </div> 

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 Velai-Vaaippu. Built with ❤️ for job seekers.</p>
      </footer>
    </div>
  );
}

export default Home;
