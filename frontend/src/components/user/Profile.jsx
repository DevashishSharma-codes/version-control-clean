import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar/Navbar";
import HeatMapProfile from "./HeatMapProfile";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [starRepos, setStarRepos] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const username = localStorage.getItem("username") || "VCTRL User";

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        if (!currentUser?._id) return;
        
        // Use currentUser._id directly since it's an object now
        const [contribRes, profileRes] = await Promise.all([
          axios.get(`http://localhost:3000/repo/contributions/${currentUser._id}`),
          axios.get(`http://localhost:3000/userProfile/${currentUser._id}`)
        ]);
        
        console.log("Fetched contributions response:", contribRes.data);

        // ✅ FIX: The API now returns a direct array.
        // Use `res.data || []` to ensure we always have an array.
        setContributions(contribRes.data || []); 
        setStarRepos(profileRes.data?.starRepos || []);

      } catch (err) {
        console.error("Error fetching data:", err);
        setContributions([]); // On error, set to an empty array to prevent crashes
        setStarRepos([]);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchContributions();
  }, [currentUser]);

  return (
    <div className="profile-bg-wrapper">
      <Navbar />
      <div className="profile-tab-nav">
        {/* ... buttons ... */}
        <button 
          className={`profile-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} 
          type="button" 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`profile-tab-btn ${activeTab === 'starred' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveTab('starred')}
        >
          Starred Repositories
        </button>
      </div>
      <div className="profile-page-wrapper">
        <div className="user-profile-section glass-card">
          {/* ... user info ... */}
          <div className="profile-image">
            <img
              src="https://cdn-icons-png.flaticon.com/128/41/41993.png"
              alt="VCTRL Logo"
              className="profile-logo-img"
            />
          </div>
          <div className="name">
            <h2>{username}</h2>
          </div>
          <div className="follower-stats">
            <span>0 Followers</span>
            <span>·</span>
            <span>0 Following</span>
          </div>
        </div>
        <div className="tab-content" style={{ padding: '20px', width: '100%', maxWidth: '800px' }}>
          {activeTab === "overview" && (
            <div className="heat-map-section glass-card">
              <HeatMapProfile contributions={contributions} />
            </div>
          )}
          {activeTab === "starred" && (
            <div className="starred-repos-section glass-card" style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '20px', color: 'white' }}>Starred Repositories ({starRepos.length})</h3>
              {profileLoading ? (
                <p>Loading starred repositories...</p>
              ) : starRepos.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {starRepos.map(repo => (
                    <div key={repo._id} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                      <h4 style={{ cursor: 'pointer', margin: '0 0 10px 0', color: '#58a6ff' }} onClick={() => navigate(`/repo/${repo._id}`)}>
                        {repo.name} ⭐️
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#c9d1d9' }}>{repo.description || "No description provided."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#8b949e' }}>You haven't starred any repositories yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;