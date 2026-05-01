"use client";import { useState, useEffect, useRef } from "react";

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: #2a2a3a;
    --accent: #00e5ff;
    --accent2: #7b61ff;
    --accent3: #ff6b6b;
    --text: #e8e8f0;
    --text-muted: #6b6b8a;
    --green: #00ff88;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; }

  .mono { font-family: 'Space Mono', monospace; }

  .scanline {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,229,255,0.015) 2px,
      rgba(0,229,255,0.015) 4px
    );
    pointer-events: none;
    position: fixed; inset: 0; z-index: 9999;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes glitch {
    0%,100% { clip-path: inset(0 0 100% 0); }
    10% { clip-path: inset(20% 0 60% 0); transform: translate(-3px); }
    20% { clip-path: inset(50% 0 30% 0); transform: translate(3px); }
    30% { clip-path: inset(10% 0 85% 0); transform: translate(-2px); }
    40% { clip-path: inset(80% 0 5% 0); transform: translate(2px); }
    50% { clip-path: inset(0 0 0 0); transform: translate(0); }
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.3s ease;
    animation: fadeUp 0.5s ease both;
  }
  .card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(0,229,255,0.1), 0 0 40px rgba(0,229,255,0.05);
    transform: translateY(-2px);
  }

  .btn-primary {
    background: var(--accent);
    color: var(--bg);
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .btn-primary:hover { opacity: 0.85; transform: scale(1.02); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-family: 'Space Mono', monospace;
    border: 1px solid;
  }

  input, textarea, select {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 8px;
    padding: 10px 14px;
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    width: 100%;
    transition: border-color 0.2s;
    outline: none;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--accent); }
  input::placeholder, textarea::placeholder { color: var(--text-muted); }

  .nav-link {
    color: var(--text-muted);
    cursor: pointer;
    font-size: 13px;
    font-family: 'Space Mono', monospace;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    text-decoration: none;
    background: none; border: none;
  }
  .nav-link:hover, .nav-link.active { color: var(--accent); background: rgba(0,229,255,0.08); }

  .loader {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }

  .glow-text {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .scrollbar-thin::-webkit-scrollbar { width: 4px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: var(--surface); }
  .scrollbar-thin::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .hero-grid {
    background-image: 
      linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    display: inline-block;
    animation: pulse 2s ease infinite;
  }
`;

// ============================================================
// SAMPLE DATA
// ============================================================
const INITIAL_PROJECTS = [
  {
    id: 1, title: "DeFi Dashboard", category: "Web3",
    description: "Real-time dashboard untuk monitoring portfolio DeFi di berbagai chain.",
    link: "https://github.com", status: "live",
    tags: ["React", "Web3.js", "Solidity"], color: "#00e5ff",
  },
  {
    id: 2, title: "AI Content Generator", category: "AI/ML",
    description: "Tools generate konten marketing otomatis menggunakan LLM.",
    link: "https://github.com", status: "beta",
    tags: ["Python", "FastAPI", "Claude"], color: "#7b61ff",
  },
  {
    id: 3, title: "E-Commerce Platform", category: "Fullstack",
    description: "Platform belanja dengan sistem rekomendasi berbasis ML.",
    link: "https://github.com", status: "live",
    tags: ["Next.js", "PostgreSQL", "Stripe"], color: "#00ff88",
  },
];

const CATEGORY_COLORS = {
  "Web3": "#00e5ff", "AI/ML": "#7b61ff", "Fullstack": "#00ff88",
  "Mobile": "#ff6b6b", "DevTools": "#ffa500", "Other": "#888",
};

// ============================================================
// MAIN APP
// ============================================================
export default function PortfolioHub() {
  const [page, setPage] = useState("home");
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [socialUpdates, setSocialUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("projects");
        if (p) setProjects(JSON.parse(p.value));
        const s = await window.storage.get("social_updates");
        if (s) setSocialUpdates(JSON.parse(s.value));
      } catch {}
    })();
  }, []);

  const saveProjects = async (updated) => {
    setProjects(updated);
    try { await window.storage.set("projects", JSON.stringify(updated)); } catch {}
  };

  const saveSocialUpdates = async (updated) => {
    setSocialUpdates(updated);
    try { await window.storage.set("social_updates", JSON.stringify(updated)); } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <style>{styles}</style>
      <div className="scanline" />
      <Navbar page={page} setPage={setPage} projectCount={projects.length} />
      <main style={{ paddingTop: "64px" }}>
        {page === "home" && <HomePage projects={projects} />}
        {page === "feed" && <SocialFeedPage projects={projects} socialUpdates={socialUpdates} saveSocialUpdates={saveSocialUpdates} />}
        {page === "admin" && <AdminPage projects={projects} saveProjects={saveProjects} />}
      </main>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage, projectCount }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: "64px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: "800", color: "var(--bg)", fontFamily: "'Space Mono'"
        }}>P</div>
        <span style={{ fontWeight: 800, fontSize: "16px", letterSpacing: "-0.5px" }}>
          Project<span className="glow-text">Hub</span>
        </span>
        <span style={{
          fontSize: "10px", fontFamily: "Space Mono", color: "var(--accent)",
          border: "1px solid var(--accent)", borderRadius: "4px", padding: "2px 6px"
        }}>{projectCount} projects</span>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {[
          { id: "home", label: "// Portfolio" },
          { id: "feed", label: "// AI Feed" },
          { id: "admin", label: "// Admin" },
        ].map(({ id, label }) => (
          <button key={id} className={`nav-link ${page === id ? "active" : ""}`}
            onClick={() => setPage(id)}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontFamily: "Space Mono", color: "var(--text-muted)" }}>
        <span className="status-dot" style={{ background: "var(--green)" }} />
        <span>ONLINE</span>
      </div>
    </nav>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ projects }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(projects.map(p => p.category))];
  const filtered = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <div>
      {/* Hero */}
      <div className="hero-grid" style={{
        padding: "80px 32px 60px", textAlign: "center",
        borderBottom: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,229,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <p className="mono" style={{ color: "var(--accent)", fontSize: "12px", letterSpacing: "4px", marginBottom: "16px" }}>
          鈻� FULL-STACK DEVELOPER 路 15 YEARS EXP
        </p>
        <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }}>
          Semua Project<br /><span className="glow-text">Dalam Satu Tempat</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Kumpulan project aktif yang diperbarui langsung dari sosial media via Claude AI Agent.
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: `${projects.length} Projects`, color: "var(--accent)" },
            { label: `${projects.filter(p => p.status === "live").length} Live`, color: "var(--green)" },
            { label: `${new Set(projects.map(p => p.category)).size} Categories`, color: "var(--accent2)" },
          ].map(({ label, color }) => (
            <span key={label} className="tag" style={{ borderColor: color, color }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div style={{ padding: "24px 32px", display: "flex", gap: "8px", flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{
              padding: "6px 16px", borderRadius: "100px", fontSize: "12px",
              fontFamily: "Space Mono", cursor: "pointer", transition: "all 0.2s",
              background: filter === cat ? "var(--accent)" : "transparent",
              color: filter === cat ? "var(--bg)" : "var(--text-muted)",
              border: filter === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px", padding: "32px",
      }}>
        {filtered.map((p, i) => (
          <ProjectCard key={p.id} project={p} delay={i * 80} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px", color: "var(--text-muted)", fontFamily: "Space Mono", fontSize: "13px" }}>
            // No projects found
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, delay }) {
  const statusColors = { live: "#00ff88", beta: "#ffa500", dev: "#7b61ff", archived: "#888" };
  return (
    <div className="card" style={{ padding: "24px", animationDelay: `${delay}ms`, cursor: "pointer" }}
      onClick={() => window.open(project.link, "_blank")}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <span className="tag" style={{ borderColor: CATEGORY_COLORS[project.category] || "#888", color: CATEGORY_COLORS[project.category] || "#888", marginBottom: "8px" }}>
            {project.category}
          </span>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginTop: "8px" }}>{project.title}</h3>
        </div>
        <span style={{
          fontSize: "10px", fontFamily: "Space Mono", padding: "4px 8px",
          borderRadius: "4px", background: statusColors[project.status] + "22",
          color: statusColors[project.status], border: `1px solid ${statusColors[project.status]}44`,
        }}>
          <span className="status-dot" style={{ background: statusColors[project.status], width: "6px", height: "6px", marginRight: "4px" }} />
          {project.status}
        </span>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.6, marginBottom: "16px" }}>
        {project.description}
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {project.tags?.map(t => (
          <span key={t} className="tag" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontSize: "10px" }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontSize: "11px", fontFamily: "Space Mono" }}>
        <span>鈫�</span><span>Buka Project</span>
      </div>
    </div>
  );
}

// ============================================================
// SOCIAL FEED PAGE (Claude Agent)
// ============================================================
function SocialFeedPage({ projects, socialUpdates, saveSocialUpdates }) {
  const [activeSource, setActiveSource] = useState("X (Twitter)");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SAMPLE_POSTS = {
    "X (Twitter)": `[Tweet 1] 馃殌 Just shipped v2.0 of DeFi Dashboard! New multi-chain support + gas tracker. Been grinding on this for weeks. Check it out!

[Tweet 2] Working on a major update for the AI Content Generator - adding GPT-4 vision support + auto-posting to social. ETA: next week 馃敟

[Tweet 3] Hot take: The future of Web3 UX is AI-powered interfaces. Been testing this on our DeFi Dashboard with amazing results 馃搳`,
    "Telegram": `[Channel Post] UPDATE PROJECT - E-Commerce Platform berhasil mencapai 1000 transaksi per hari! Sistem rekomendasi ML kita naik akurasi 23%.

[Channel Post] Bug kritis di payment gateway sudah dipatch. Versi 3.1.2 sudah live. Thanks to tim yang lembur semalam 馃挭

[Channel Post] Roadmap Q2 2026: Tambah fitur AR try-on, integrasi crypto payment, dan revamp UI mobile app.`,
  };

  const analyzeWithClaude = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");

    try {
      const projectList = projects.map(p => `- ${p.title} (${p.category}): ${p.description}`).join("\n");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Kamu adalah AI agent yang menganalisis postingan sosial media developer dan mengekstrak informasi project terbaru.
Daftar project yang ada:
${projectList}

Tugasmu: Analisis setiap post, ekstrak update penting, dan hubungkan ke project yang relevan.
Balas HANYA dengan JSON array berikut format (tidak ada teks lain, tidak ada markdown/backtick):
[
  {
    "source": "X/Telegram",
    "summary": "ringkasan singkat update (max 100 kata)",
    "projectName": "nama project terkait atau null",
    "sentiment": "positive/neutral/negative",
    "type": "update/announcement/bug_fix/roadmap",
    "priority": "high/medium/low"
  }
]`,
          messages: [{ role: "user", content: `Analisis postingan berikut dari ${activeSource}:\n\n${inputText}` }],
        }),
      });

      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("") || "[]";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const newUpdates = parsed.map((u, i) => ({
        id: Date.now() + i,
        ...u,
        source: activeSource,
        timestamp: new Date().toLocaleString("id-ID"),
      }));

      await saveSocialUpdates([...newUpdates, ...socialUpdates].slice(0, 20));
      setInputText("");
    } catch (e) {
      setError("Gagal memproses. Cek koneksi API atau format input.");
    } finally {
      setLoading(false);
    }
  };

  const typeColors = {
    update: "var(--accent)", announcement: "var(--accent2)",
    bug_fix: "var(--accent3)", roadmap: "var(--green)",
  };
  const sentimentEmoji = { positive: "馃搱", neutral: "馃搳", negative: "鈿狅笍" };
  const priorityColor = { high: "var(--accent3)", medium: "var(--accent)", low: "var(--text-muted)" };

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "11px", letterSpacing: "3px", marginBottom: "8px" }}>
          鈻� CLAUDE AI AGENT
        </p>
        <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
          Social Media <span className="glow-text">Feed Analyzer</span>
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Paste postingan dari X atau Telegram 鈫� Claude menganalisis & menampilkan update project otomatis.
        </p>
      </div>

      {/* Input Section */}
      <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["X (Twitter)", "Telegram"].map(src => (
            <button key={src} onClick={() => setActiveSource(src)}
              style={{
                padding: "8px 16px", borderRadius: "8px", fontSize: "12px",
                fontFamily: "Space Mono", cursor: "pointer", transition: "all 0.2s",
                background: activeSource === src ? (src === "X (Twitter)" ? "#1a1a2e" : "#1a1a2e") : "transparent",
                color: activeSource === src ? "var(--accent)" : "var(--text-muted)",
                border: `1px solid ${activeSource === src ? "var(--accent)" : "var(--border)"}`,
              }}>
              {src === "X (Twitter)" ? "饾晱 Twitter" : "鉁� Telegram"}
            </button>
          ))}
          <button className="btn-ghost" style={{ marginLeft: "auto", fontSize: "10px" }}
            onClick={() => setInputText(SAMPLE_POSTS[activeSource])}>
            鈫� Load Sample Data
          </button>
        </div>

        <textarea
          rows={6} value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={`Paste postingan dari ${activeSource} di sini...\n\nContoh:\n[Post 1] Update terbaru project...\n[Post 2] Announcement...`}
          style={{ marginBottom: "12px", resize: "vertical" }}
        />

        {error && (
          <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", color: "var(--accent3)", fontSize: "12px", fontFamily: "Space Mono", marginBottom: "12px" }}>
            鈿� {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="btn-primary" onClick={analyzeWithClaude}
            disabled={loading || !inputText.trim()}>
            {loading ? <><span className="loader" style={{ width: 14, height: 14, marginRight: 8 }} />Analyzing...</> : "鈻� Analisis dengan Claude"}
          </button>
          {socialUpdates.length > 0 && (
            <span style={{ fontSize: "11px", fontFamily: "Space Mono", color: "var(--text-muted)" }}>
              {socialUpdates.length} updates tersimpan
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {socialUpdates.length > 0 ? (
        <div>
          <h3 style={{ fontFamily: "Space Mono", fontSize: "12px", color: "var(--text-muted)", letterSpacing: "2px", marginBottom: "16px" }}>
            // HASIL ANALISIS CLAUDE
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            {socialUpdates.map(u => (
              <div key={u.id} className="card" style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "18px" }}>{sentimentEmoji[u.sentiment]}</span>
                    <span className="tag" style={{ borderColor: typeColors[u.type] || "var(--border)", color: typeColors[u.type] || "var(--text-muted)", fontSize: "10px" }}>
                      {u.type?.replace("_", " ")}
                    </span>
                    {u.projectName && (
                      <span className="tag" style={{ borderColor: "var(--accent2)", color: "var(--accent2)", fontSize: "10px" }}>
                        馃搨 {u.projectName}
                      </span>
                    )}
                    <span style={{ fontSize: "10px", color: priorityColor[u.priority], fontFamily: "Space Mono" }}>
                      [{u.priority?.toUpperCase()} PRIORITY]
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "Space Mono" }}>{u.source}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "Space Mono" }}>{u.timestamp}</span>
                  </div>
                </div>
                <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text)" }}>{u.summary}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: "center", padding: "60px 32px",
          border: "1px dashed var(--border)", borderRadius: "12px", color: "var(--text-muted)",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>馃</div>
          <p className="mono" style={{ fontSize: "13px" }}>// Belum ada analisis</p>
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
  const [form, setForm] = useState({ title: "", category: "Fullstack", description: "", link: "", status: "dev", tags: "" });
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.link) return;
    const newProject = {
      ...form,
      id: editing ?? Date.now(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      color: CATEGORY_COLORS[form.category] || "#888",
    };
    const updated = editing
      ? projects.map(p => p.id === editing ? newProject : p)
      : [...projects, newProject];
    await saveProjects(updated);
    setForm({ title: "", category: "Fullstack", description: "", link: "", status: "dev", tags: "" });
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleEdit = (p) => {
    setForm({ ...p, tags: p.tags?.join(", ") || "" });
    setEditing(p.id);
  };

  const handleDelete = async (id) => {
    await saveProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "11px", letterSpacing: "3px", marginBottom: "8px" }}>
          鈻� DASHBOARD
        </p>
        <h2 style={{ fontSize: "32px", fontWeight: 800 }}>
          Manage <span className="glow-text">Projects</span>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>
        {/* Form */}
        <div className="card" style={{ padding: "24px", height: "fit-content" }}>
          <h3 style={{ fontFamily: "Space Mono", fontSize: "12px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "20px" }}>
            {editing ? "// EDIT PROJECT" : "// TAMBAH PROJECT BARU"}
          </h3>

          <div style={{ display: "grid", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>NAMA PROJECT *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. DeFi Dashboard" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>KATEGORI</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {Object.keys(CATEGORY_COLORS).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>STATUS</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {["live", "beta", "dev", "archived"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>DESKRIPSI</label>
              <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Jelaskan project ini..." />
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>LINK PROJECT *</label>
              <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
            </div>

            <div>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Space Mono", display: "block", marginBottom: "6px" }}>TAGS (pisah koma)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="React, Node.js, PostgreSQL" />
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button className="btn-primary" onClick={handleSubmit} disabled={!form.title || !form.link} style={{ flex: 1 }}>
                {saved ? "鉁� Tersimpan!" : editing ? "Update Project" : "+ Tambah Project"}
              </button>
              {editing && (
                <button className="btn-ghost" onClick={() => { setEditing(null); setForm({ title: "", category: "Fullstack", description: "", link: "", status: "dev", tags: "" }); }}>
                  Batal
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Project List */}
        <div>
          <h3 style={{ fontFamily: "Space Mono", fontSize: "12px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "16px" }}>
            // PROJECT LIST ({projects.length})
          </h3>
          <div style={{ display: "grid", gap: "10px", maxHeight: "600px", overflowY: "auto" }} className="scrollbar-thin">
            {projects.map(p => (
              <div key={p.id} className="card" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px" }}>{p.title}</span>
                    <span className="tag" style={{ borderColor: CATEGORY_COLORS[p.category] || "#888", color: CATEGORY_COLORS[p.category] || "#888", fontSize: "9px" }}>
                      {p.category}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.description}
                  </p>
                  <a href={p.link} target="_blank" rel="noreferrer"
                    style={{ fontSize: "11px", fontFamily: "Space Mono", color: "var(--accent)", textDecoration: "none" }}
                    onClick={e => e.stopPropagation()}>
                    鈫� {p.link.substring(0, 35)}{p.link.length > 35 ? "..." : ""}
                  </a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <button className="btn-ghost" style={{ fontSize: "10px", padding: "4px 10px" }} onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}
                    style={{ padding: "4px 10px", borderRadius: "6px", background: "rgba(255,107,107,0.1)", color: "var(--accent3)", border: "1px solid rgba(255,107,107,0.3)", fontSize: "10px", cursor: "pointer", fontFamily: "Space Mono" }}>
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
