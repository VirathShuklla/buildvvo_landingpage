import { useEffect, useState } from "react";
import { KeyRound, Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "../ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { api, formatErr } from "../../lib/api";

const inp = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-[border-color,box-shadow]";
const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—");

const CreateForm = ({ onCreated }) => {
  const [f, setF] = useState({ name: "", username: "", password: "" });
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post("/users", { ...f, username: f.username.trim().toLowerCase() });
      onCreated(data);
      setF({ name: "", username: "", password: "" });
      toast.success(`Sales login created for ${data.name}`);
    } catch (err) { toast.error(formatErr(err)); } finally { setSaving(false); }
  };
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 sm:p-8" data-testid="team-create-form">
      <p className="font-display text-xl font-bold">Create a sales login</p>
      <p className="mt-1 text-sm text-muted-foreground">Sales users can only view and work leads — no analytics, settings, team management or deleting leads.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <input data-testid="team-name-input" className={inp} placeholder="Full name" value={f.name} onChange={set("name")} required minLength={2} />
        <input data-testid="team-username-input" className={inp} placeholder="Username (e.g. rahul.sales)" value={f.username} onChange={set("username")} required pattern="[a-zA-Z0-9._\-]{3,30}" title="3–30 letters, numbers, dot, dash or underscore" />
        <input data-testid="team-password-input" className={inp} type="text" placeholder="Password (min 8 chars)" value={f.password} onChange={set("password")} required minLength={8} />
      </div>
      <button disabled={saving} data-testid="team-create-button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-3 text-sm font-medium hover:bg-[#3651D4] transition-colors disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Create login
      </button>
    </form>
  );
};

const UserRow = ({ u, onUpdate, onDelete }) => {
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const patch = async (body, msg) => {
    try { const { data } = await api.patch(`/users/${u.id}`, body); onUpdate(data); toast.success(msg); } catch (e) { toast.error(formatErr(e)); }
  };
  const del = async () => {
    try { await api.delete(`/users/${u.id}`); onDelete(u.id); toast.success("Login removed"); } catch (e) { toast.error(formatErr(e)); }
  };
  const isSales = u.role === "sales";
  return (
    <li className="p-4 sm:p-5" data-testid={`team-user-${u.username}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-bold">{(u.name || u.username)[0].toUpperCase()}</span>
          <div className="min-w-0">
            <p className="font-semibold truncate flex items-center gap-2">{u.name || u.username}
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${isSales ? "bg-secondary" : "bg-navy text-cream dark:bg-cream dark:text-navy"}`}>{u.role}</span>
              {!u.active && <span className="rounded-full bg-rose-500/15 text-rose-600 px-2 py-0.5 text-[10px] font-semibold">Disabled</span>}
            </p>
            <p className="text-xs text-muted-foreground truncate">@{u.username} · added {fmt(u.created_at)}</p>
          </div>
        </div>
        {isSales && (
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-2 text-sm mr-2">
              <Switch checked={u.active} onCheckedChange={(v) => patch({ active: v }, v ? "Login enabled" : "Login disabled")} data-testid={`team-active-switch-${u.username}`} />Active
            </label>
            <button onClick={() => setShowPw((s) => !s)} data-testid={`team-reset-toggle-${u.username}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium hover:border-primary transition-colors"><KeyRound className="h-3.5 w-3.5" />Reset password</button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button data-testid={`team-delete-${u.username}`} aria-label="Delete login" className="grid h-9 w-9 place-items-center rounded-full border border-border text-destructive hover:border-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove {u.name}'s login?</AlertDialogTitle>
                  <AlertDialogDescription>They will immediately lose access. Leads and notes they worked on are kept.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={del} data-testid={`team-delete-confirm-${u.username}`} className="bg-destructive text-white hover:bg-destructive/90">Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      {showPw && (
        <div className="mt-4 flex gap-2 sm:pl-[52px]">
          <input data-testid={`team-new-password-${u.username}`} className={inp} placeholder="New password (min 8 chars)" value={pw} onChange={(e) => setPw(e.target.value)} />
          <button disabled={pw.length < 8} data-testid={`team-save-password-${u.username}`} onClick={() => { patch({ password: pw }, "Password updated"); setPw(""); setShowPw(false); }}
            className="shrink-0 rounded-xl bg-navy text-cream dark:bg-cream dark:text-navy px-4 text-sm font-medium disabled:opacity-40">Save</button>
        </div>
      )}
    </li>
  );
};

export const TeamPanel = () => {
  const [users, setUsers] = useState(null);
  useEffect(() => { api.get("/users").then(({ data }) => setUsers(data)).catch((e) => toast.error(formatErr(e))); }, []);
  const onUpdate = (u) => setUsers((us) => us.map((x) => (x.id === u.id ? u : x)));
  return (
    <div className="space-y-6 max-w-5xl" data-testid="admin-team-panel">
      <div>
        <p className="eyebrow mb-2">Team</p>
        <h1 className="text-2xl sm:text-4xl font-extrabold">Sales team logins</h1>
      </div>
      <CreateForm onCreated={(u) => setUsers((us) => [...(us || []), u])} />
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {!users ? <p className="p-8 text-sm text-muted-foreground">Loading team…</p> : (
          <ul className="divide-y divide-border" data-testid="team-user-list">
            {users.map((u) => <UserRow key={u.id} u={u} onUpdate={onUpdate} onDelete={(id) => setUsers((us) => us.filter((x) => x.id !== id))} />)}
          </ul>
        )}
      </div>
    </div>
  );
};
