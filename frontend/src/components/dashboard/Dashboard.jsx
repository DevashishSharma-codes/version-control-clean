import { useEffect, useMemo, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../../authContext";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

// 📊 Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  // This is new for the doughnut chart
  ArcElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Import the new TechStackChart component
import TechStackChart from "../TechStackChart/TechStackChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  // Register the new element
  ArcElement
);

// Custom Chart Component for the line chart (no changes here)
const ChartComponent = ({ chartData }) => {
  const data = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Repositories",
        data: chartData.map((d) => d.repos),
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.1)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.8)");
          return gradient;
        },
        borderColor: "#6366F1",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#aaa",
        },
        border: {
          display: true,
          color: "#444"
        }
      },
      y: {
        grid: {
          color: "#333",
          drawBorder: false,
        },
        ticks: {
          color: "#aaa",
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(30, 30, 30, 0.9)",
        titleColor: "#6366F1",
        bodyColor: "#fff",
        borderColor: "#444",
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: 300 }} className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // --- UI state ---
  const [repositories, setRepositories] = useState([]);
  const [globalRepositories, setGlobalRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGlobals, setFilteredGlobals] = useState([]);
  const [username] = useState(() => localStorage.getItem("username") || "User");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingGlobals, setLoadingGlobals] = useState(true);

  // Right column: Blogs and Events
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [blogsError, setBlogsError] = useState("");
  const [eventsError, setEventsError] = useState("");

  // Manual fallback
  const fallbackNews = useMemo(
    () => [
      {
        id: "f1",
        type: "Update",
        title: "AI Code Suggestions shipped",
        meta: "August 15, 2025",
        description: "Get smart, context-aware suggestions right in your editor.",
      },
      {
        id: "f2",
        type: "Event",
        title: "Dev Summit 2025 – Early Bird",
        meta: "September 10, 2025",
        description: "Register early for the biggest dev event of the year.",
      },
      {
        id: "f3",
        type: "Blog",
        title: "Optimizing your CI/CD",
        meta: "July 28, 2025",
        description: "Speed up builds and ship reliably with these patterns.",
      },
    ],
    []
  );

  // --- Fetch from backend ---
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    async function fetchUserRepos() {
      setLoadingRepos(true);
      try {
        const res = await fetch(`https://version-control-backend-ssgn.onrender.com/repo/user/${userId}`);
        const data = await res.json();

        const list = data?.repositories || [];
        setRepositories(Array.isArray(list) ? list : []);
      } catch (e) {
        setRepositories([]);
      } finally {
        setLoadingRepos(false);
      }
    }

    async function fetchGlobalRepos() {
      setLoadingGlobals(true);
      try {
        const res = await fetch(`https://version-control-backend-ssgn.onrender.com/repo/all`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setGlobalRepositories(list);
        setFilteredGlobals(list);
      } catch (e) {
        setGlobalRepositories([]);
        setFilteredGlobals([]);
      } finally {
        setLoadingGlobals(false);
      }
    }

    fetchUserRepos();
    fetchGlobalRepos();
  }, []);

  // --- Search filter ---
  useEffect(() => {
    const q = (searchQuery || "").toLowerCase();
    if (!q) {
      setFilteredGlobals(globalRepositories);
    } else {
      setFilteredGlobals(
        globalRepositories.filter((repo) =>
          (repo?.name || "").toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, globalRepositories]);

  // --- Blogs + Events ---
  useEffect(() => {
    let cancelled = false;

    async function fetchBlogs() {
      setLoadingBlogs(true);
      setBlogsError("");
      try {
        const res = await fetch("https://dev.to/api/articles?per_page=6&top=1");
        if (!res.ok) throw new Error("Failed to load blogs");
        const data = await res.json();
        if (!cancelled) setBlogs(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (e) {
        if (!cancelled) {
          setBlogs([]);
          setBlogsError("Could not load blogs.");
        }
      } finally {
        if (!cancelled) setLoadingBlogs(false);
      }
    }

    async function fetchEvents() {
      setLoadingEvents(true);
      setEventsError("");
      try {
        const res = await fetch(
          "https://dev.to/api/articles?per_page=6&tag=events"
        );
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        if (!cancelled) setEvents(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (e) {
        if (!cancelled) {
          setEvents([]);
          setEventsError("Could not load events.");
        }
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    }

    fetchBlogs();
    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  // --- Chart Data (Repos created per month) ---
  const chartData = useMemo(() => {
    if (!globalRepositories.length) return [];

    const counts = {};
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    globalRepositories
      .filter((repo) => new Date(repo.createdAt) > oneMonthAgo)
      .forEach((repo) => {
        const created = new Date(repo.createdAt || repo.date || Date.now());
        const monthDay = created.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        counts[monthDay] = (counts[monthDay] || 0) + 1;
      });

    // Generate a list of the last 30 days to ensure continuous data
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30Days.push(
        d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
    }

    return last30Days.map((date) => ({
      date,
      repos: counts[date] || 0,
    }));
  }, [globalRepositories]);

  // Handlers
  const handleCreateRepo = () => navigate("/repo/create");
  const handleLogout = () => {
    navigate("/auth");
  };
  const handleRepoClick = (repoId) => {
    navigate(`/repo/${repoId}`);
  };

  return (
    <>
      <Navbar onCreateRepo={handleCreateRepo} onLogout={handleLogout} />

      <section id="dashboard" className="pro-dashboard">
        {/* Top header */}
        <header className="dashboard-header">
          <div>
            <h2>
              Hello, <span className="dash-username">{username}</span>!
            </h2>
            <p className="dashboard-header-sub">
              What do you plan to <span className="dash-username">BUILD</span>{" "}
              today?
            </p>
          </div>
        </header>

        {/* Top Line Chart Section */}
        <section className="panel panel-wide">
          <div className="panel-head">
            <h3 className="panel-title chart-panel-title">
              Repositories Created <span className="chart-title-mobile-hide">(Last 30 Days)</span>
            </h3>
          </div>
          <ChartComponent chartData={chartData} />
        </section>

        {/* Main Layout Grid */}
        <div className="dashboard-grid">
          {/* Global Repos */}
          <section className="panel">
            <div className="panel-head">
              <h3 className="panel-title">Global Repositories</h3>
              <div className="panel-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search global repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="list-grid">
              {loadingGlobals ? (
                <div className="skeleton-col">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="row-card skeleton" />
                  ))}
                </div>
              ) : filteredGlobals.length ? (
                filteredGlobals.slice(0, 10).map((repo) => (
                  <button
                    type="button"
                    className="row-card"
                    key={repo._id || repo.id}
                    onClick={() => handleRepoClick(repo._id || repo.id)}
                  >
                    <div className="row-main">
                      <div className="row-title">{repo.name}</div>
                      <div className="row-desc">
                        {repo.description || "No description provided."}
                      </div>
                    </div>
                    <div className="row-meta">
                      <span className="chip chip-blue">Global</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="muted">No global repositories found.</p>
              )}
            </div>
          </section>

          {/* Your Repos */}
          <section className="panel panel-wide">
            <div className="panel-head">
              <h3 className="panel-title">Your Repositories</h3>
              <div className="panel-actions">
                <button className="btn-primary" onClick={handleCreateRepo}>
                  New Repository
                </button>
              </div>
            </div>

            <div className="list-grid">
              {loadingRepos ? (
                <div className="skeleton-col">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="row-card skeleton" />
                  ))}
                </div>
              ) : repositories.length ? (
                repositories.slice(0, 12).map((repo) => (
                  <button
                    type="button"
                    className="row-card"
                    key={repo._id || repo.id}
                    onClick={() => handleRepoClick(repo._id || repo.id)}
                  >
                    <div className="row-main">
                      <div className="row-title">{repo.name}</div>
                      <div className="row-desc">
                        {repo.description || "No description provided."}
                      </div>
                    </div>
                    <div className="row-meta">
                      <span className="chip chip-gray">Yours</span>
                    </div>
                  </button>
                ))
              ) : (
                <p className="muted">
                  You don’t have any repositories yet. Create one to get started.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* NEW Full-width grid for the bottom sections */}
        <section className="dashboard-grid">
          {/* Column 1: Tech Chart */}
          <div className="panel">
            <TechStackChart
              repos={globalRepositories}
              title="Global Tech Distribution"
            />
          </div>

          {/* Column 2: Blogs and Events */}
          <aside className="panel panel-rail">
            <div className="stack">
              <div className="panel-sub">
                <div className="panel-head tight">
                  <h4 className="panel-title">Blogs</h4>
                </div>
                <div className="rail-list">
                  {loadingBlogs ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="rail-item skeleton" />
                    ))
                  ) : blogs.length ? (
                    blogs.map((a) => (
                      <a
                        className="rail-item"
                        key={a.id}
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        title={a.title}
                      >
                        <div className="rail-title">{a.title}</div>
                        <div className="rail-meta">
                          {a.readable_publish_date ||
                            a.published_at?.slice(0, 10)}
                          <span className="dot" />
                          {a.tag_list?.slice(0, 2).map((t) => `#${t}`).join(" ")}
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="muted">
                      {blogsError || "No blogs available right now."}
                    </div>
                  )}
                </div>
              </div>

              <div className="panel-sub">
                <div className="panel-head tight">
                  <h4 className="panel-title">Events</h4>
                </div>
                <div className="rail-list">
                  {loadingEvents ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="rail-item skeleton" />
                    ))
                  ) : events.length ? (
                    events.map((a) => (
                      <a
                        className="rail-item"
                        key={a.id}
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        title={a.title}
                      >
                        <div className="rail-title">{a.title}</div>
                        <div className="rail-meta">
                          {a.readable_publish_date ||
                            a.published_at?.slice(0, 10)}
                          <span className="dot" />
                          {a.tag_list?.slice(0, 2).map((t) => `#${t}`).join(" ")}
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="muted">
                      {eventsError || "No events available right now."}
                    </div>
                  )}
                </div>
              </div>

              {/* Fallback block */}
              {!loadingBlogs &&
                !loadingEvents &&
                blogs.length === 0 &&
                events.length === 0 && (
                  <div className="panel-sub">
                    <div className="panel-head tight">
                      <h4 className="panel-title small">News</h4>
                    </div>
                    <div className="rail-list">
                      {fallbackNews.map((n) => (
                        <div className="rail-item" key={n.id}>
                          <div className="rail-title">{n.title}</div>
                          <div className="rail-meta">
                            {n.type}
                            <span className="dot" />
                            {n.meta}
                          </div>
                          <div className="rail-desc">{n.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </aside>
        </section>
      </section>
    </>
  );
}