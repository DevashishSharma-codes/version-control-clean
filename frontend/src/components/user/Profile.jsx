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

  const username = localStorage.getItem("username") || "VCTRL User";

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        if (!currentUser?._id) return;
        
        // Use currentUser._id directly since it's an object now
        const res = await axios.get(`/repo/contributions/${currentUser._id}`);
        
        console.log("Fetched contributions response:", res.data);

        // ✅ FIX: The API now returns a direct array.
        // Use `res.data || []` to ensure we always have an array.
        setContributions(res.data || []); 

      } catch (err) {
        console.error("Error fetching contributions:", err);
        setContributions([]); // On error, set to an empty array to prevent crashes
      }
    };

    fetchContributions();
  }, [currentUser]);

  return (
    <div className="profile-bg-wrapper">
      <Navbar />
      <div className="profile-tab-nav">
        {/* ... buttons ... */}
        <button className="profile-tab-btn active" type="button">
          Overview
        </button>
        <button
          className="profile-tab-btn"
          type="button"
          onClick={() => navigate("/repo")}
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
        <div className="heat-map-section glass-card">
          <HeatMapProfile contributions={contributions} />
        </div>
      </div>
    </div>
  );
};

export default Profile;