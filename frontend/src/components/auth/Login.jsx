import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import catAnimation from './space.json';
import './Signup.css';
import { useAuth } from '../../authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const catContainerRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(email)) newErrors.email = 'Enter a valid email address.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormMouseMove = (event) => {
    if (!catContainerRef.current || !formRef.current || window.innerWidth < 768) return;

    const formRect = formRef.current.getBoundingClientRect();
    const cursorX = event.clientX - formRect.left - 120;
    const cursorY = event.clientY - formRect.top - 70;

    gsap.to(catContainerRef.current, {
      x: cursorX,
      y: cursorY,
      duration: 0.18,
      ease: 'power2.out',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await axios.post('https://version-control-backend-ssgn.onrender.com/login', {
        email,
        password,
      });

      if (res.data && res.data.token && res.data.userId) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('username', res.data.username);
        setCurrentUser({ _id: res.data.userId });
        navigate('/');
      } else {
        setErrors({ api: 'Login failed: Incomplete response from server.' });
      }
    } catch (error) {
      const apiError =
        error?.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrors({ api: apiError });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="header-section">
          <a
            href="#"
            className="header-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}
          >
            <span style={{ display: 'inline-block', width: '2.3rem', height: '2.3rem' }}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/41/41993.png"
                alt="GitHub Logo"
                className="navbar-logo-img"
              />
            </span>
            <span
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                letterSpacing: '0.09em',
                background: 'linear-gradient(90deg,#d9d4ff,#a68cff 80%,#60e7db 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              VCTRL
            </span>
          </a>
        </div>

        <div className="form-wrapper login-form-bg">
          <div
            className="form-content"
            ref={formRef}
            onMouseMove={handleFormMouseMove}
            style={{ cursor: isLoading ? 'wait' : undefined }}
          >
            <div className="cat-roamer" ref={catContainerRef}>
              <div className="cat-lottie">
                <Lottie
                  animationData={catAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            <h1 className="form-title">Login to your account</h1>
            <p className="form-description">
              Enter your email and password to log in
            </p>

            <form className="form" autoComplete="off" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="off"
                  value={email}
                  disabled={isLoading}
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
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              {errors.api && (
                <span className="field-error api-error">{errors.api}</span>
              )}

              <button
                className={`submit-button ${isLoading ? 'loading' : ''}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="btn-loading-content">
                    <span className="spinner"></span>
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </button>

              {isLoading && (
                <div className="auth-status-pill">
                  <span className="spinner small"></span>
                  Authenticating your account...
                </div>
              )}

              <button
                className="secondary-button"
                type="button"
                onClick={handleSignUpClick}
                disabled={isLoading}
              >
                Don't have an account? Sign up
              </button>
            </form>

            <div className="divider-text"></div>

            <p className="terms-text">
              By logging in, you agree to our{' '}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}