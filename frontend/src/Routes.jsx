import React from "react";
import { useRoutes, useNavigate, useLocation } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Splash from "./components/splash/Splash";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepoForm from "./components/repo/CreateRepoForm";
import RepoDetails from "./components/repo/RepoDetails";
import CodeReview from "./components/codeReview/CodeReviewAgent";

import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  // 1. Get the loading state from the context
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const protectedRoutes = ["/dashboard", "/profile", "/repo/create", "/code-review"];
  const authRoutes = ["/auth", "/signup"];

  React.useEffect(() => {
    // Wait until the loading is false before making any routing decisions
    if (!loading) {
      const isProtectedRoute = protectedRoutes.includes(location.pathname);
      const isAuthRoute = authRoutes.includes(location.pathname);

      // If user is not logged in and tries to access a protected route, redirect to login
      if (!currentUser && isProtectedRoute) {
        navigate("/auth", { replace: true });
      }

      // If user is logged in and tries to access login/signup, redirect to dashboard
      if (currentUser && isAuthRoute) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [currentUser, loading, navigate, location.pathname]);

  // 2. While loading, show a loading indicator to prevent rendering the wrong page
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#000', color: 'white' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // 3. Define the routes. This part is unchanged.
  const element = useRoutes([
    { path: "/", element: <Splash /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/profile", element: <Profile /> },
    { path: "/repo/create", element: <CreateRepoForm /> },
    { path: "/repo/:id", element: <RepoDetails /> },
    { path: "/code-review", element: <CodeReview /> },
  ]);

  return element;
};

export default ProjectRoutes;