import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import axios from 'axios';
import catAnimation from './space.json';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';

export default function Signup() {
  const catContainerRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { setCurrentUser, setCurrentUsername } = useAuth(); // Ensure setCurrentUsername is added in context

  // Validation states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation handler
  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(email)) newErrors.email = 'Enter a valid email address.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Animated cat follows cursor
  const handleFormMouseMove = (event) => {
    if (!catContainerRef.current || !formRef.current) return;
    const formRect = formRef.current.getBoundingClientRect();
    const cursorX = event.clientX - formRect.left - 150;
    const cursorY = event.clientY - formRect.top - 100;
    gsap.to(catContainerRef.current, {
      x: cursorX,
      y: cursorY,
      duration: 0.18,
      ease: 'power2.out',
    });
  };

  // Submission handler with navigate (SPA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await axios.post("https://version-control-backend-ssgn.onrender.com/signup", {
          username: username,
          email: email,
          password: password,
        });
        if (res.data && res.data.token && res.data.userId && res.data.username) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem("username", res.data.username);

          setCurrentUser({ _id: res.data.userId });
          setCurrentUsername(res.data.username);  // Update username state here

          navigate('/'); // SPA navigation to dashboard or home page
        } else {
          alert("Signup failed: Incomplete response from server.");
        }
      } catch (error) {
        let apiError = "Error during signup.";
        if (error.response?.data?.message) apiError = error.response.data.message;
        alert(apiError);
        console.error('Error during signup:', error);
      }
    }
  };

  const handleSignUpClick = () => {
    navigate('/auth');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="header-section">
          <a href="#" className="header-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={{ display: 'inline-block', width: '2.3rem', height: '2.3rem' }}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/41/41993.png"
                alt="GitHub Logo"
                className="navbar-logo-img"
              />
            </span>
            <span style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.09em',
              background: 'linear-gradient(90deg,#d9d4ff,#a68cff 80%,#60e7db 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              VCTRL
            </span>
          </a>
        </div>
        <div className="form-wrapper signup-form-unique-bg">
          <div
            className="form-content"
            ref={formRef}
            onMouseMove={handleFormMouseMove}
            style={{ cursor: 'none' }}
          >
            <div className="cat-roamer" ref={catContainerRef}>
              <div className="cat-lottie">
                <Lottie
                  animationData={catAnimation}
                  loop={true}
                  style={{ width: 500, height: 200 }}
                />
              </div>
            </div>
            <h1 className="form-title">Create an account</h1>
            <p className="form-description">
              Enter your username, email, and password to create your account
            </p>
            <form className="form" autoComplete="off" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <span className="field-error">{errors.username}</span>}
              </div>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <button className="submit-button" type="submit">
                Sign up with Email
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={handleSignUpClick}
              >
                Already have an account? Log in
              </button>
            </form>
            <div className="divider-text"></div>
            <p className="terms-text">
              By clicking continue, you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
