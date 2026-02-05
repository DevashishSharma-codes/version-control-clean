import React from "react";
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight } from "lucide-react";
import "./splash.css";

// 1. Import the new component
import ImageCursorTrail from "../ImageCursorTrail/ImageCursorTrail"; 

// 2. Create the array of tech stack images
const techImages = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
];


export default function Splash() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    const userId = localStorage.getItem("userId");
    navigate(userId ? "/dashboard" : "/auth");
  };

  const tickerLine = "VCTRL👾 Lightning-fast git & code review for modern teams!";
  const tickerText = Array(18).fill(tickerLine).join("\u00A0") + "\u00A0";

  return (
    <>
      {/* 3. Wrap your main content in the ImageCursorTrail component */}
      <ImageCursorTrail
        items={techImages}
        maxNumberOfImages={7} // How many images to show in the trail
        distance={30} // The spacing between images
        imgClass="tech-trail-image" // A custom class for styling the images
        className="cursor-trail-container" // The new container class
      >
        {/* All your existing content goes inside as a child */}
        <div className="modern-splash">
          <div className="splash-content">
            <h1 className="main-title big-bold-title">
              <span className="big-gradient-title">Modern Version Control</span>
            </h1>
            <div className="wrap-btn-outer">
              <button className="wrap-btn-group" onClick={handleGetStarted}>
                <div className="wrap-btn-inner-main">
                  <Globe className="mx-2 animate-spin-slow" />
                  <p className="wrap-btn-label">Get started</p>
                </div>
                <div className="wrap-btn-arrow">
                  <ArrowRight size={18} className="arrow-icon" />
                </div>
              </button>
            </div>
            <div className="splash-arrows">↓<br />↓</div>
            <div className="splash-caption">
              To make your team's workflow live by just <b>copy and collaborate</b>.
            </div>
          </div>
        </div>
      </ImageCursorTrail>

      {/* The ticker footer remains OUTSIDE and will not be affected */}
      <footer className="footer-scroll-stack">
        <div className="text-scroll-effect">
          <div className="text-scroll-inner">
            <span className="text-scroll-gradient">
              {tickerText}
              <ArrowRight size={32} strokeWidth={2.5} className="scroll-arrow-icon" />
            </span>
            <span className="text-scroll-gradient">
              {tickerText}
              <ArrowRight size={32} strokeWidth={2.5} className="scroll-arrow-icon" />
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}