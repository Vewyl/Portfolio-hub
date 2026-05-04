"use client";
import { useState, useEffect, useRef } from "react";

// ============================================================
// THEME STYLES — Dark & Light
// ============================================================
const getStyles = (isDark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --bg:         ${isDark ? "#0d0d0d" : "#f5f5f0"};
    --surface:    ${isDark ? "#161616" : "#ffffff"};
    --surface2:   ${isDark ? "#1e1e1e" : "#f0f0eb"};
    --border:     ${isDark ? "#2a2a2a" : "#e0e0d8"};
    --accent:     ${isDark ? "#00e5ff" : "#0070f3"};
    --accent2:    ${isDark ? "#7b61ff" : "#6d28d9"};
    --accent3:    ${isDark ? "#ff6b6b" : "#ef4444"};
    --text:       ${isDark ? "#ededed" : "#111111"};
    --text-muted: ${isDark ? "#666666" : "#888888"};
    --green:      ${isDark ? "#00ff88" : "#16a34a"};
    --shadow:     ${isDark ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)"};
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; transition: background 0.3s, color 0.3s; }
  .mono { font-family: 'Space Mono', monospace; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes scaleIn { from { transform:scale(0.95); opacity:0; } to { transform:scale(1); opacity:1; } }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    transition: all 0.25s ease;
    animation: fadeUp 0.4s ease both;
  }
  .card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent), var(--shadow);
    transform: translateY(-3px);
  }

  .btn-primary {
    background: var(--accent);
    color: ${isDark ? "#000" : "#fff"};
    border: none; padding: 10px 20px; border-radius: 10px;
    font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: var(--shadow); }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .btn-ghost {
    background: transparent; color: var(--text-muted);
    border: 1px solid var(--border); padding: 8px 16px; border-radius: 10px;
    font-family: 'Space Mono', monospace; font-size: 11px;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: ${isDark ? "rgba(0,229,255,0.06)" : "rgba(0,112,243,0.06)"}; }

  .tag {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-family: 'Space Mono', monospace; border: 1px solid;
  }

  input, textarea, select {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); border-radius: 10px; padding: 10px 14px;
    font-family: 'Inter', sans-serif; font-size: 13px; width: 100%;
    transition: border-color 0.2s; outline: none;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px ${isDark ? "rgba(0,229,255,0.1)" : "rgba(0,112,243,0.1)"}; }
  input::placeholder, textarea::placeholder { color: var(--text-muted); }
  select option { background: var(--surface); }

  .nav-link {
    color: var(--text-muted); cursor: pointer; font-size: 13px;
    font-family: 'Space Mono', monospace; padding: 6px 12px; border-radius: 8px;
    transition: all 0.2s; text-decoration: none; background: none; border: none;
  }
  .nav-link:hover, .nav-link.active { color: var(--accent); background: ${isDark ? "rgba(0,229,255,0.08)" : "rgba(0,112,243,0.08)"}; }

  .loader { width:16px; height:16px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius:50%; animation: spin 0.8s linear infinite; display:inline-block; }

  .glow-text { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

  .status-dot { width:7px; height:7px; border-radius:50%; display:inline-block; animation: pulse 2s ease infinite; }

  .scrollbar-thin::-webkit-scrollbar { width: 4px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: var(--surface); }
  .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: fadeIn 0.2s ease;
  }
  .modal-box {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; width: 100%; max-width: 640px;
    max-height: 90vh; overflow-y: auto;
    animation: scaleIn 0.25s ease; box-shadow: var(--shadow);
  }

  .chat-bubble-user {
    background: var(--accent); color: ${isDark ? "#000" : "#fff"};
    border-radius: 18px 18px 4px 18px;
    padding: 10px 14px; font-size: 13px; max-width: 80%; align-self: flex-end;
    line-height: 1.5;
  }
  .chat-bubble-ai {
    background: var(--surface2); color: var(--text);
    border: 1px solid var(--border);
    border-radius: 18px 18px 18px 4px;
    padding: 10px 14px; font-size: 13px; max-width: 85%; align-self: flex-start;
    line-height: 1.6;
  }
  .chat-widget {
    position: fixed; bottom: 24px; right: 24px; z-index: 500;
    animation: slideIn 0.3s ease;
  }

  .skill-bar-track {
    background: var(--surface2); border-radius: 100px; height: 6px; overflow: hidden;
  }
  .skill-bar-fill {
    height: 100%; border-radius: 100px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transition: width 1s ease;
  }
  
  .filter-chip {
    padding: 6px 14px; border-radius: 100px; font-size: 12px;
    font-family: 'Space Mono', monospace; cursor: pointer; transition: all 0.2s;
    border: 1px solid var(--border); background: transparent; color: var(--text-muted);
  }
  .filter-chip.active {
    background: var(--accent); color: ${isDark ? "#000" : "#fff"};
    border-color: var(--accent);
  }
  .filter-chip:hover:not(.active) { border-color: var(--accent); color: var(--accent); }
`;

// ============================================================
// DATA
// ============================================================
const INITIAL_PROJECTS = [
  { id: 1, title: "DeFi Dashboard", category: "Web3", description: "Real-time dashboard untuk monitoring portfolio DeFi di berbagai chain. Mendukung Ethereum, BSC, dan Polygon.", link: "https://github.com", status: "live", tags: ["React", "Web3.js", "Solidity"], color: "#00e5ff", screenshot: "", highlights: ["Multi-chain support", "Real-time price feed", "Gas tracker"] },
  { id: 2, title: "AI Content Generator", category: "AI/ML", description: "Tools generate konten marketing otomatis menggunakan LLM. Integrasi Claude API untuk hasil yang natural.", link: "https://github.com", status: "beta", tags: ["Python", "FastAPI", "Claude"], color: "#7b61ff", screenshot: "", highlights: ["Bulk generation", "SEO optimized", "Multi-language"] },
  { id: 3, title: "E-Commerce Platform", category: "Fullstack", description: "Platform belanja dengan sistem rekomendasi berbasis ML. Checkout cepat dan aman dengan berbagai metode pembayaran.", link: "https://github.com", status: "live", tags: ["Next.js", "PostgreSQL", "Stripe"], color: "#00ff88", screenshot: "", highlights: ["ML recommendations", "Fast checkout", "Analytics dashboard"] },
];

const CATEGORY_COLORS = { "Web3": "#00e5ff", "AI/ML": "#7b61ff", "Fullstack": "#00ff88", "Mobile": "#ff6b6b", "DevTools": "#ffa500", "Other": "#888" };

const ABOUT_DATA = {
  name: "Vewyl",
  title: "Full-Stack Developer",
  bio: "15 tahun di dunia coding. Passionate tentang Web3, AI, dan membangun produk yang berdampak nyata. Suka problem-solving dan selalu eksplor teknologi baru.",
  location: "Jakarta, Indonesia",
  skills: [
    { name: "React / Next.js", level: 95 },
    { name: "Node.js / Python", level: 90 },
    { name: "Web3 / Solidity", level: 80 },
    { name: "AI / LLM Integration", level: 85 },
    { name: "Database Design", level: 88 },
  ],
  socials: [
    { label: "GitHub", url: "https://github.com" },
    { label: "Twitter/X", url: "https://x.com" },
    { label: "LinkedIn", url: "https://linkedin.com" },
  ]
};

// ============================================================
// MAIN APP
// ============================================================
export default function PortfolioHub() {
  const [page, setPage] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [socialUpdates, setSocialUpdates] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("projects_v2");
        if (p) setProjects(JSON.parse(p.value));
        const s = await window.storage.get("social_updates_v2");
        if (s) setSocialUpdates(JSON.parse(s.value));
        const t = await window.storage.get("theme");
        if (t) setIsDark(t.value === "dark");
      } catch {}
    })();
  }, []);

  const saveProjects = async (u) => { setProjects(u); try { await window.storage.set("projects_v2", JSON.stringify(u)); } catch {} };
  const saveSocial = async (u) => { setSocialUpdates(u); try { await window.storage.set("social_updates_v2", JSON.stringify(u)); } catch {} };
  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try { await window.storage.set("theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", transition: "background 0.3s" }}>
      <style>{getStyles(isDark)}</style>

      <Navbar page={page} setPage={setPage} isDark={isDark} toggleTheme={toggleTheme} projectCount={projects.length} />

      <main style={{ paddingTop: "64px" }}>
        {page === "home"  && <HomePage projects={projects} onSelectProject={setSelectedProject} />}
        {page === "about" && <AboutPage />}
        {page === "feed"  && <SocialFeedPage projects={projects} socialUpdates={socialUpdates} saveSocial={saveSocial} />}
        {page === "admin" && <AdminPage projects={projects} saveProjects={saveProjects} />}
      </main>

      {/* Project Detail Modal */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} isDark={isDark} />}

      {/* Claude Chatbot */}
      <ChatWidget open={chatOpen} setOpen={setChatOpen} projects={projects} isDark={isDark} />
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage, isDark, toggleTheme, projectCount }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: isDark ? "rgba(13,13,13,0.9)" : "rgba(245,245,240,0.9)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px", height: "64px", gap: "8px",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: isDark ? "#000" : "#fff", fontFamily: "Space Mono" }}>P</div>
        <span style={{ fontWeight: 700, fontSize: "15px" }}>Project<span className="glow-text">Hub</span></span>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { id: "home", label: "Portfolio" },
          { id: "about", label: "About" },
          { id: "feed", label: "AI Feed" },
          { id: "admin", label: "Admin" },
        ].map(({ id, label }) => (
          <button key={id} className={`nav-link ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>{label}</button>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span style={{ fontSize: "11px", fontFamily: "Space Mono", color: "var(--accent)", border: "1px solid var(--border)", borderRadius: "6px", padding: "2px 8px" }}>{projectCount}</span>
        {/* Dark/Light Toggle */}
        <button onClick={toggleTheme} style={{
          width: "40px", height: "22px", borderRadius: "100px",
          background: isDark ? "var(--accent)" : "var(--border)",
          border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0,
        }}>
          <div style={{
            width: "16px", height: "16px", borderRadius: "50%",
            background: isDark ? "#000" : "#fff",
            position: "absolute", top: "3px",
            left: isDark ? "21px" : "3px", transition: "left 0.3s",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px",
          }}>{isDark ? "🌙" : "☀️"}</div>
        </button>
      </div>
    </nav>
  );
}

// ============================================================
// HOME PAGE — with Search & Filter
// ============================================================
function HomePage({ projects, onSelectProject }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const categories = ["All", ...new Set(projects.map(p => p.category))];

  const filtered = projects
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q));
      const matchCat = filter === "All" || p.category === filter;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  const stats = [
    { label: "Total Projects", val: projects.length, color: "var(--accent)" },
    { label: "Live", val: projects.filter(p => p.status === "live").length, color: "var(--green)" },
    { label: "In Beta", val: projects.filter(p => p.status === "beta").length, color: "#ffa500" },
    { label: "Categories", val: new Set(projects.map(p => p.category)).size, color: "var(--accent2)" },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: "64px 24px 48px", textAlign: "center", borderBottom: "1px solid var(--border)", background: "linear-gradient(180deg, transparent, var(--bg))" }}>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "11px", letterSpacing: "4px", marginBottom: "16px" }}>FULL-STACK DEVELOPER · 15 YRS EXP</p>
        <h1 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 700, lineHeight: 1.15, marginBottom: "16px", letterSpacing: "-1px" }}>
          Semua Project<br /><span className="glow-text">Dalam Satu Tempat</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", maxWidth: "460px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          Portfolio aktif yang diperbarui langsung dari sosial media via Claude AI Agent.
        </p>
        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          {stats.map(s => (
            <div key={s.label} style={{ padding: "10px 20px", borderRadius: "12px", border: `1px solid ${s.color}33`, background: `${s.color}0d` }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: s.color, fontFamily: "Space Mono" }}>{s.val}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "14px" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari project, tags, teknologi..." style={{ paddingLeft: "36px" }} />
        </div>
        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: "auto", minWidth: "140px" }}>
          <option value="default">Default</option>
          <option value="name">A → Z</option>
          <option value="status">By Status</option>
        </select>
      </div>

      {/* Category Chips */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} className={`filter-chip ${filter === cat ? "active" : ""}`} onClick={() => setFilter(cat)}>{cat}</button>
        ))}
        {(search || filter !== "All") && (
          <button className="filter-chip" onClick={() => { setSearch(""); setFilter("All"); }} style={{ borderColor: "var(--accent3)", color: "var(--accent3)" }}>✕ Reset</button>
        )}
      </div>

      {/* Result count */}
      {(search || filter !== "All") && (
        <div style={{ padding: "12px 24px 0", fontSize: "12px", fontFamily: "Space Mono", color: "var(--text-muted)" }}>
          {filtered.length} project ditemukan
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", padding: "24px" }}>
        {filtered.map((p, i) => (
          <ProjectCard key={p.id} project={p} delay={i * 60} onClick={() => onSelectProject(p)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
            <p className="mono" style={{ fontSize: "13px" }}>Tidak ada project yang cocok</p>
            <p style={{ fontSize: "13px", marginTop: "8px" }}>Coba kata kunci lain atau reset filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, delay, onClick }) {
  const statusColors = { live: "#00ff88", beta: "#ffa500", dev: "#7b61ff", archived: "#888" };
  return (
    <div className="card" style={{ padding: "24px", animationDelay: `${delay}ms`, cursor: "pointer" }} onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <span className="tag" style={{ borderColor: CATEGORY_COLORS[project.category] || "#888", color: CATEGORY_COLORS[project.category] || "#888" }}>{project.category}</span>
          <h3 style={{ fontSize: "17px", fontWeight: 700, marginTop: "10px", letterSpacing: "-0.3px" }}>{project.title}</h3>
        </div>
        <span style={{ fontSize: "10px", fontFamily: "Space Mono", padding: "4px 8px", borderRadius: "6px", background: `${statusColors[project.status]}18`, color: statusColors[project.status], border: `1px solid ${statusColors[project.status]}44`, whiteSpace: "nowrap" }}>
          <span className="status-dot" style={{ background: statusColors[project.status], marginRight: "4px" }} />{project.status}
        </span>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.7, marginBottom: "16px" }}>{project.description}</p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {project.tags?.map(t => <span key={t} className="tag" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontSize: "10px" }}>{t}</span>)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--accent)", fontFamily: "Space Mono" }}>Lihat Detail →</span>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>↗ Open</span>
      </div>
    </div>
  );
}

// ============================================================
// PROJECT DETAIL MODAL
// ============================================================
function ProjectModal({ project, onClose, isDark }) {
  const statusColors = { live: "#00ff88", beta: "#ffa500", dev: "#7b61ff", archived: "#888" };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box scrollbar-thin" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span className="tag" style={{ borderColor: CATEGORY_COLORS[project.category] || "#888", color: CATEGORY_COLORS[project.category] || "#888" }}>{project.category}</span>
            <h2 style={{ fontSize: "24px", fontWeight: 700, marginTop: "10px", letterSpacing: "-0.5px" }}>{project.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Screenshot placeholder */}
        <div style={{ margin: "20px 24px", borderRadius: "12px", border: "1px solid var(--border)", background: `linear-gradient(135deg, ${CATEGORY_COLORS[project.category] || "#888"}18, var(--surface2))`, height: "180px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {project.screenshot ? (
            <img src={project.screenshot} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
          ) : (
            <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>🖼️</div>
              <p style={{ fontSize: "12px", fontFamily: "Space Mono" }}>Screenshot belum ditambahkan</p>
              <p style={{ fontSize: "11px", marginTop: "4px" }}>Edit di Admin → tambahkan URL gambar</p>
            </div>
          )}
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          {/* Status + Link */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontFamily: "Space Mono", padding: "5px 10px", borderRadius: "6px", background: `${statusColors[project.status]}18`, color: statusColors[project.status], border: `1px solid ${statusColors[project.status]}44` }}>
              <span className="status-dot" style={{ background: statusColors[project.status], marginRight: "4px" }} />{project.status}
            </span>
            <a href={project.link} target="_blank" rel="noreferrer" style={{ fontSize: "12px", fontFamily: "Space Mono", color: "var(--accent)", textDecoration: "none" }}>↗ Buka Project</a>
          </div>

          {/* Description */}
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.75, marginBottom: "20px" }}>{project.description}</p>

          {/* Highlights */}
          {project.highlights?.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "11px", fontFamily: "Space Mono", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "10px" }}>FITUR UTAMA</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {project.highlights.map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px" }}>
                    <span style={{ color: "var(--accent)", fontSize: "16px" }}>✓</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <p style={{ fontSize: "11px", fontFamily: "Space Mono", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "10px" }}>TEKNOLOGI</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {project.tags?.map(t => <span key={t} className="tag" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 100); }, []);

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: "40px" }}>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "11px", letterSpacing: "4px", marginBottom: "8px" }}>ABOUT ME</p>
        <h2 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-1px" }}>Halo, saya <span className="glow-text">{ABOUT_DATA.name}</span> 👋</h2>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ padding: "28px", marginBottom: "24px", display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0 }}>
          👨‍💻
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "20px", marginBottom: "4px" }}>{ABOUT_DATA.name}</div>
          <div style={{ color: "var(--accent)", fontFamily: "Space Mono", fontSize: "12px", marginBottom: "12px" }}>{ABOUT_DATA.title}</div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.75, marginBottom: "14px" }}>{ABOUT_DATA.bio}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)" }}>
            <span>📍</span><span>{ABOUT_DATA.location}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="card" style={{ padding: "28px", marginBottom: "24px" }}>
        <p className="mono" style={{ fontSize: "11px", letterSpacing: "3px", color: "var(--text-muted)", marginBottom: "20px" }}>SKILLS & EXPERTISE</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {ABOUT_DATA.skills.map((s, i) => (
            <div key={s.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                <span>{s.name}</span>
                <span style={{ fontFamily: "Space Mono", color: "var(--accent)", fontSize: "11px" }}>{s.level}%</span>
              </div>
              <div className="skill-bar-track">
                <div className="skill-bar-fill" style={{ width: animate ? `${s.level}%` : "0%", transitionDelay: `${i * 100}ms` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Socials */}
      <div className="card" style={{ padding: "28px" }}>
        <p className="mono" style={{ fontSize: "11px", letterSpacing: "3px", color: "var(--text-muted)", marginBottom: "20px" }}>CONNECT WITH ME</p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {ABOUT_DATA.socials.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn-ghost" style={{ fontSize: "13px", padding: "10px 20px" }}>↗ {s.label}</button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CLAUDE CHATBOT WIDGET
// ============================================================
function ChatWidget({ open, setOpen, projects, isDark }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Halo! Aku Claude, AI assistant untuk portfolio ini. Tanya apapun tentang project yang ada! 👋" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const projectContext = projects.map(p => `- ${p.title} (${p.category}, status: ${p.status}): ${p.description}. Tags: ${p.tags?.join(", ")}`).join("\n");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Kamu adalah AI assistant yang ramah untuk portfolio website developer bernama ${ABOUT_DATA.name}. Jawab pertanyaan tentang project-project berikut dengan singkat, jelas, dan friendly. Gunakan bahasa Indonesia. Max 150 kata per jawaban.

Daftar Project:
${projectContext}

Info Developer:
- Nama: ${ABOUT_DATA.name}
- Title: ${ABOUT_DATA.title}
- Lokasi: ${ABOUT_DATA.location}
- Bio: ${ABOUT_DATA.bio}`,
          messages: [
            ...messages.filter(m => m.role !== "ai" || messages.indexOf(m) > 0).map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })),
            { role: "user", content: userMsg }
          ],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Maaf, ada error. Coba lagi ya!";
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Koneksi bermasalah. Coba lagi ya! 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      {open && (
        <div style={{
          width: "320px", height: "440px", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: "20px",
          boxShadow: "var(--shadow)", display: "flex", flexDirection: "column",
          marginBottom: "12px", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🤖</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px" }}>Claude Assistant</div>
                <div style={{ fontSize: "10px", color: "var(--green)", fontFamily: "Space Mono", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span className="status-dot" style={{ background: "var(--green)", width: "5px", height: "5px" }} /> Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }} className="scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble-ai">
                <span className="loader" style={{ width: "12px", height: "12px" }} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Tanya tentang project..." style={{ fontSize: "12px", padding: "8px 12px" }}
            />
            <button className="btn-primary" onClick={send} disabled={!input.trim() || loading} style={{ padding: "8px 14px", flexShrink: 0 }}>
              {loading ? <span className="loader" /> : "↑"}
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setOpen(o => !o)} style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: open ? "var(--surface2)" : "linear-gradient(135deg, var(--accent), var(--accent2))",
          border: "1px solid var(--border)", cursor: "pointer", fontSize: "22px",
          boxShadow: "var(--shadow)", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {open ? "×" : "🤖"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SOCIAL FEED PAGE
// ============================================================
function SocialFeedPage({ projects, socialUpdates, saveSocial }) {
  const [activeSource, setActiveSource] = useState("X (Twitter)");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SAMPLE_POSTS = {
    "X (Twitter)": `[Tweet 1] 🚀 Just shipped v2.0 of DeFi Dashboard! New multi-chain support + gas tracker. Been grinding on this for weeks!\n\n[Tweet 2] Working on major update for AI Content Generator - adding vision support + auto-posting. ETA: next week 🔥\n\n[Tweet 3] Hot take: The future of Web3 UX is AI-powered interfaces. Testing this on DeFi Dashboard 📊`,
    "Telegram": `[Post 1] UPDATE - E-Commerce Platform mencapai 1000 transaksi/hari! Sistem rekomendasi ML naik akurasi 23%.\n\n[Post 2] Bug kritis di payment gateway sudah dipatch. Versi 3.1.2 sudah live 💪\n\n[Post 3] Roadmap Q2 2026: Tambah AR try-on, crypto payment, revamp mobile UI.`,
  };

  const analyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true); setError("");
    try {
      const projectList = projects.map(p => `- ${p.title} (${p.category}): ${p.description}`).join("\n");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Analisis postingan sosial media developer, ekstrak update project.\nProject list:\n${projectList}\nBalas HANYA JSON array (tanpa markdown/backtick):\n[{"source":"X/Telegram","summary":"ringkasan max 80 kata","projectName":"nama project atau null","sentiment":"positive/neutral/negative","type":"update/announcement/bug_fix/roadmap","priority":"high/medium/low"}]`,
          messages: [{ role: "user", content: `Analisis dari ${activeSource}:\n\n${inputText}` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.map(b => b.text || "").join("") || "[]";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const newUpdates = parsed.map((u, i) => ({ id: Date.now() + i, ...u, source: activeSource, timestamp: new Date().toLocaleString("id-ID") }));
      await saveSocial([...newUpdates, ...socialUpdates].slice(0, 20));
      setInputText("");
    } catch { setError("Gagal memproses. Coba lagi."); }
    finally { setLoading(false); }
  };

  const typeColors = { update: "var(--accent)", announcement: "var(--accent2)", bug_fix: "var(--accent3)", roadmap: "var(--green)" };
  const sentimentEmoji = { positive: "📈", neutral: "📊", negative: "⚠️" };
  const priorityColor = { high: "var(--accent3)", medium: "var(--accent)", low: "var(--text-muted)" };

  return (
    <div style={{ padding: "32px 24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "11px", letterSpacing: "3px", marginBottom: "8px" }}>CLAUDE AI AGENT</p>
        <h2 style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.5px" }}>Social Media <span className="glow-text">Feed Analyzer</span></h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>Paste postingan dari X atau Telegram → Claude analisis otomatis.</p>
      </div>

      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {["X (Twitter)", "Telegram"].map(src => (
            <button key={src} onClick={() => setActiveSource(src)} className={`filter-chip ${activeSource === src ? "active" : ""}`}>
              {src === "X (Twitter)" ? "𝕏 Twitter" : "✈ Telegram"}
            </button>
          ))}
          <button className="btn-ghost" style={{ marginLeft: "auto" }} onClick={() => setInputText(SAMPLE_POSTS[activeSource])}>← Sample Data</button>
        </div>
        <textarea rows={5} value={inputText} onChange={e => setInputText(e.target.value)} placeholder={`Paste postingan ${activeSource} di sini...`} style={{ marginBottom: "12px", resize: "vertical" }} />
        {error && <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: "var(--accent3)", fontSize: "12px", marginBottom: "12px" }}>⚠ {error}</div>}
        <button className="btn-primary" onClick={analyze} disabled={loading || !inputText.trim()}>
          {loading ? <><span className="loader" /> Analyzing...</> : "▸ Analisis dengan Claude"}
        </button>
      </div>

      {socialUpdates.length > 0 ? (
        <div style={{ display: "grid", gap: "12px" }}>
          {socialUpdates.map(u => (
            <div key={u.id} className="card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <span>{sentimentEmoji[u.sentiment]}</span>
                  <span className="tag" style={{ borderColor: typeColors[u.type] || "var(--border)", color: typeColors[u.type] || "var(--text-muted)", fontSize: "10px" }}>{u.type?.replace("_", " ")}</span>
                  {u.projectName && <span className="tag" style={{ borderColor: "var(--accent2)", color: "var(--accent2)", fontSize: "10px" }}>📂 {u.projectName}</span>}
                  <span style={{ fontSize: "10px", color: priorityColor[u.priority], fontFamily: "Space Mono" }}>[{u.priority?.toUpperCase()}]</span>
                </div>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "Space Mono" }}>{u.timestamp}</span>
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.7 }}>{u.summary}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 24px", border: "1px dashed var(--border)", borderRadius: "16px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤖</div>
          <p className="mono" style={{ fontSize: "12px" }}>Belum ada analisis</p>
          <p style={{ fontSize: "13px", marginTop: "8px" }}>Paste postingan sosmed di atas dan klik Analisis</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN PAGE
// ============================================================
function AdminPage({ projects, saveProjects }) {
  const [form, setForm] = useState({ title: "", category: "Fullstack", description: "", link: "", status: "dev", tags: "", screenshot: "", highlights: "" });
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.link) return;
    const newProject = {
      ...form, id: editing ?? Date.now(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      highlights: form.highlights.split(",").map(h => h.trim()).filter(Boolean),
      color: CATEGORY_COLORS[form.category] || "#888",
    };
    const updated = editing ? projects.map(p => p.id === editing ? newProject : p) : [...projects, newProject];
    await saveProjects(updated);
    setForm({ title: "", category: "Fullstack", description: "", link: "", status: "dev", tags: "", screenshot: "", highlights: "" });
    setEditing(null); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (p) => {
    setForm({ ...p, tags: p.tags?.join(", ") || "", highlights: p.highlights?.join(", ") || "" });
    setEditing(p.id);
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "11px", letterSpacing: "3px", marginBottom: "8px" }}>DASHBOARD</p>
        <h2 style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.5px" }}>Manage <span className="glow-text">Projects</span></h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
        {/* Form */}
        <div className="card" style={{ padding: "24px", height: "fit-content" }}>
          <h3 className="mono" style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "20px" }}>
            {editing ? "// EDIT PROJECT" : "// TAMBAH PROJECT BARU"}
          </h3>
          <div style={{ display: "grid", gap: "14px" }}>
            {[
              { label: "NAMA PROJECT *", key: "title", placeholder: "e.g. DeFi Dashboard" },
              { label: "DESKRIPSI", key: "description", placeholder: "Jelaskan project ini...", textarea: true },
              { label: "LINK PROJECT *", key: "link", placeholder: "https://..." },
              { label: "SCREENSHOT URL", key: "screenshot", placeholder: "https://i.imgur.com/..." },
              { label: "TAGS (pisah koma)", key: "tags", placeholder: "React, Node.js, Python" },
              { label: "HIGHLIGHTS (pisah koma)", key: "highlights", placeholder: "Multi-chain, Real-time, Fast" },
            ].map(({ label, key, placeholder, textarea }) => (
              <div key={key}>
                <label style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>{label}</label>
                {textarea ? (
                  <textarea rows={3} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                ) : (
                  <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                )}
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>KATEGORI</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {Object.keys(CATEGORY_COLORS).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>STATUS</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {["live", "beta", "dev", "archived"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-primary" onClick={handleSubmit} disabled={!form.title || !form.link} style={{ flex: 1 }}>
                {saved ? "✓ Tersimpan!" : editing ? "Update" : "+ Tambah"}
              </button>
              {editing && <button className="btn-ghost" onClick={() => { setEditing(null); setForm({ title: "", category: "Fullstack", description: "", link: "", status: "dev", tags: "", screenshot: "", highlights: "" }); }}>Batal</button>}
            </div>
          </div>
        </div>

        {/* List */}
        <div>
          <h3 className="mono" style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "16px" }}>// PROJECT LIST ({projects.length})</h3>
          <div style={{ display: "grid", gap: "10px", maxHeight: "680px", overflowY: "auto" }} className="scrollbar-thin">
            {projects.map(p => (
              <div key={p.id} className="card" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{p.title}</span>
                    <span className="tag" style={{ borderColor: CATEGORY_COLORS[p.category] || "#888", color: CATEGORY_COLORS[p.category] || "#888", fontSize: "9px" }}>{p.category}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</p>
                  <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: "11px", fontFamily: "Space Mono", color: "var(--accent)", textDecoration: "none" }} onClick={e => e.stopPropagation()}>↗ {p.link.substring(0, 30)}{p.link.length > 30 ? "..." : ""}</a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <button className="btn-ghost" style={{ fontSize: "10px", padding: "4px 10px" }} onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => saveProjects(projects.filter(x => x.id !== p.id))} style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(255,107,107,0.1)", color: "var(--accent3)", border: "1px solid rgba(255,107,107,0.3)", fontSize: "10px", cursor: "pointer", fontFamily: "Space Mono" }}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
