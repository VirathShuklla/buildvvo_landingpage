import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Inbox, LogOut, Settings, ExternalLink } from "lucide-react";
import { api, TOKEN_KEY } from "../../lib/api";
import { usePageMeta } from "../../lib/seo";
import { Logo } from "../../components/site/Logo";
import { ThemeToggle } from "../../components/site/Navbar";
import { Overview } from "../../components/admin/Overview";
import { LeadsPanel } from "../../components/admin/LeadsPanel";
import { SettingsPanel } from "../../components/admin/SettingsPanel";

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "leads", label: "Leads", icon: Inbox },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  usePageMeta("Admin Dashboard", "BuildVVO lead dashboard");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    navigate("/admin/login");
  }, [navigate]);

  const loadStats = useCallback(() => api.get("/stats").then(({ data }) => setStats(data)).catch(() => {}), []);

  useEffect(() => {
    api.get("/auth/me").then(({ data }) => { setUser(data); loadStats(); }).catch(logout);
  }, [logout, loadStats]);

  if (!user) return <div className="min-h-screen grid place-items-center text-muted-foreground" data-testid="admin-loading">Loading…</div>;

  return (
    <div className="min-h-screen bg-secondary/40" data-testid="admin-dashboard">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><Logo /><span className="hidden sm:inline rounded-full bg-primary/10 text-primary font-mono text-[10px] uppercase tracking-widest px-2.5 py-1">Admin</span></div>
          <nav className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} data-testid={`admin-tab-${t.id}`}
                className={`inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-sm transition-colors ${tab === t.id ? "bg-navy text-cream dark:bg-cream dark:text-navy" : "text-muted-foreground hover:text-foreground"}`}>
                <t.icon className="h-4 w-4" /><span className="hidden md:inline">{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="hidden sm:grid h-10 w-10 place-items-center rounded-full border border-foreground/15 hover:bg-foreground/5" data-testid="admin-view-site-link" aria-label="View site"><ExternalLink className="h-4 w-4" /></a>
            <ThemeToggle />
            <button onClick={logout} data-testid="admin-logout-button" aria-label="Log out" className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 hover:bg-foreground/5"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 sm:px-8 py-8 sm:py-10">
        {tab === "overview" && <Overview stats={stats} onGoLeads={() => setTab("leads")} />}
        {tab === "leads" && <LeadsPanel onChange={loadStats} />}
        {tab === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}
