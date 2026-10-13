import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { api, formatErr, TOKEN_KEY } from "../../lib/api";
import { usePageMeta } from "../../lib/seo";
import { Logo } from "../../components/site/Logo";
import { ThemeToggle } from "../../components/site/Navbar";

export default function AdminLogin() {
  usePageMeta("Admin Login", "BuildVVO admin login");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      navigate("/admin");
    } catch (err) {
      setError(formatErr(err));
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full rounded-xl border border-input bg-background px-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-[border-color,box-shadow]";
  return (
    <div className="min-h-screen grid lg:grid-cols-2" data-testid="admin-login-page">
      <div className="hidden lg:flex flex-col justify-between bg-navy text-cream p-14 relative overflow-hidden grain">
        <div className="absolute -right-32 -bottom-32 h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[120px]" />
        <Logo light />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">Lead command centre</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.05] max-w-md">Every enquiry. Every follow-up. One place.</h1>
        </div>
        <p className="text-cream/40 text-sm">BuildVVO Technologies Private Limited</p>
      </div>
      <div className="flex flex-col p-6 sm:p-12">
        <div className="flex justify-between items-center"><span className="lg:hidden"><Logo /></span><span className="ml-auto"><ThemeToggle /></span></div>
        <form onSubmit={submit} className="m-auto w-full max-w-sm space-y-5" data-testid="admin-login-form">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Lock className="h-5 w-5" /></span>
          <div>
            <h2 className="text-3xl font-extrabold">Admin sign in</h2>
            <p className="mt-2 text-muted-foreground text-sm">Access the BuildVVO lead dashboard.</p>
          </div>
          <input data-testid="admin-login-username-input" className={input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
          <input data-testid="admin-login-password-input" className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {error && <p className="text-sm text-destructive" data-testid="admin-login-error">{error}</p>}
          <button data-testid="admin-login-submit-button" disabled={loading} className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-white py-3.5 font-medium hover:bg-[#3651D4] transition-colors disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
