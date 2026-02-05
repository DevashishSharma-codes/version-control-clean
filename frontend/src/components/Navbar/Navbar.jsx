import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Import the new icon
import { ArrowRight, Plus, LogOut, User, Bot } from "lucide-react";
import { useAuth } from "../../authContext";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const navigateToCreateRepo = () => {
    navigate("/repo/create");
    setMenuOpen(false);
  };

  // 2. Create a new handler function for the AI review page
  const navigateToCodeReview = () => {
    navigate("/code-review");
    setMenuOpen(false); // Ensures mobile menu closes on click
  };

  return (
    <nav className="pro-navbar dark-navbar">
      <Link to="/" className="navbar-logo-area" onClick={() => setMenuOpen(false)}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/41/41993.png"
          alt="Logo"
          className="navbar-logo-img"
        />
        <span className="navbar-brand-title">VCTRL</span>
      </Link>

      <div className={`navbar-link-group ${menuOpen ? "active" : ""}`}>
        <button className="wrap-btn-group navbar-action-btn" onClick={navigateToCreateRepo}>
          <span className="wrap-btn-inner-main">
            <Plus size={20} className="mx-2" />
            <span className="wrap-btn-label-nav">Create Repo</span>
          </span>
          <span className="wrap-btn-arrow">
            <ArrowRight size={18} className="arrow-icon" />
          </span>
        </button>

        {/* 3. Add the new AI Code Review button here */}
        <button className="wrap-btn-group navbar-action-btn" onClick={navigateToCodeReview}>
            <span className="wrap-btn-inner-main">
               
                <span className="wrap-btn-label-nav">Review Your Code</span>
            </span>
            <span className="wrap-btn-arrow">
                <ArrowRight size={18} className="arrow-icon" />
            </span>
        </button>


        <Link to="/profile" className="navbar-profile-btn" onClick={() => setMenuOpen(false)}>
          <User size={20} className="mx-2" />
          <span className="navbar-link-label">Profile</span>
        </Link>

        <button className="wrap-btn-group navbar-logout-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>
          <span className="wrap-btn-inner-main">
            <LogOut size={18} className="mx-2" />
            <span className="wrap-btn-label-nav">Logout</span>
          </span>
        </button>
      </div>

      <div
        className={`navbar-menu-toggle ${menuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
};

export default Navbar;