import { useCallback, useEffect, useState } from "react";
import { Download, Search, CalendarClock, PhoneCall, Columns3, List } from "lucide-react";
import { toast } from "sonner";
import { api, formatErr } from "../../lib/api";
import { SOFTWARE_TYPES } from "../../data/content";
import { LeadSheet } from "./LeadSheet";
import { LeadBoard } from "./LeadBoard";
import { StatusBadge, StatusSelect, STATUSES } from "./StatusControls";

const SOURCES = ["Google", "Instagram", "LinkedIn", "Facebook", "Direct", "Referral", "WhatsApp", "YouTube"];
const sel = "rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary";
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const today = () => new Date().toISOString().slice(0, 10);

const exportCsv = (leads) => {
  const cols = ["created_at", "name", "company", "phone", "email", "software_type", "budget", "timeline", "status", "source", "consultation", "follow_up_date", "description"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `buildvvo-leads-${today()}.csv`;
  a.click();
};

export const LeadsPanel = ({ onChange, canDelete = false }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", status: "", source: "", software_type: "" });
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState(() => localStorage.getItem("bvvo_leads_view") || "board");

  const load = useCallback(() => {
    setLoading(true);
    api.get("/leads", { params: filters }).then(({ data }) => setLeads(data)).catch((e) => toast.error(formatErr(e))).finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const upsert = (lead) => { setLeads((ls) => ls.map((l) => (l.id === lead.id ? lead : l))); onChange(); };
  const remove = (id) => { setLeads((ls) => ls.filter((l) => l.id !== id)); setActiveId(null); onChange(); };

  const changeStatus = async (lead, status) => {
    try {
      const { data } = await api.patch(`/leads/${lead.id}`, { status });
      upsert(data);
      toast.success(`Status updated to ${status}`);
    } catch (e) { toast.error(formatErr(e)); }
  };

  const moveLead = async (lead, status) => {
    const prev = lead.status;
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    try {
      const { data } = await api.patch(`/leads/${lead.id}`, { status });
      upsert(data);
      toast.success(`${lead.name} moved to ${status}`);
    } catch (e) {
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status: prev } : l)));
      toast.error(formatErr(e));
    }
  };

  const switchView = (v) => { setView(v); localStorage.setItem("bvvo_leads_view", v); };
  const setF = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));
  const active = leads.find((l) => l.id === activeId);

  return (
    <div className="space-y-6" data-testid="admin-leads-panel">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Pipeline</p>
          <h1 className="text-2xl sm:text-4xl font-extrabold">Leads <span className="text-muted-foreground font-bold text-xl sm:text-2xl" data-testid="admin-leads-count">({leads.length})</span></h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex rounded-full border border-border bg-card p-1" data-testid="admin-leads-view-toggle">
            {[["board", Columns3, "Board"], ["table", List, "List"]].map(([v, I, label]) => (
              <button key={v} onClick={() => switchView(v)} data-testid={`admin-leads-view-${v}`} aria-label={`${label} view`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${view === v ? "bg-navy text-cream dark:bg-cream dark:text-navy" : "text-muted-foreground hover:text-foreground"}`}>
                <I className="h-4 w-4" /><span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => exportCsv(leads)} disabled={!leads.length} data-testid="admin-export-csv-button" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:border-primary disabled:opacity-50 transition-colors">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span> CSV
          </button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="relative col-span-2 md:col-span-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input data-testid="admin-leads-search-input" value={filters.q} onChange={setF("q")} placeholder="Search name, company, email, phone…" className={`${sel} w-full pl-10`} />
        </label>
        <select data-testid="admin-filter-status" value={filters.status} onChange={setF("status")} className={sel}>
          <option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select data-testid="admin-filter-source" value={filters.source} onChange={setF("source")} className={sel}>
          <option value="">All sources</option>{SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select data-testid="admin-filter-software" value={filters.software_type} onChange={setF("software_type")} className={`${sel} col-span-2 md:col-span-1`}>
          <option value="">All software types</option>{SOFTWARE_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {view === "board" ? (
        <LeadBoard leads={leads} onMove={moveLead} onOpen={setActiveId} />
      ) : (<>
      <div className="md:hidden space-y-3" data-testid="admin-lead-cards">
        {leads.map((l) => {
          const overdue = l.follow_up_date && l.follow_up_date <= today() && !["Won", "Lost"].includes(l.status);
          return (
            <div key={l.id} onClick={() => setActiveId(l.id)} data-testid={`lead-card-${l.id}`} className="rounded-2xl border border-border bg-card p-4 active:bg-secondary/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold flex items-center gap-2 truncate">{l.name}{l.consultation && <PhoneCall className="h-3.5 w-3.5 text-primary shrink-0" />}</p>
                  <p className="text-xs text-muted-foreground truncate">{l.company || "—"} · {l.phone}</p>
                </div>
                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                  <StatusSelect value={l.status} onChange={(s) => changeStatus(l, s)} testid={`lead-card-status-select-${l.id}`} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded-full bg-secondary px-2.5 py-1">{l.software_type}</span>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-mono">{l.budget}</span>
                <span className="rounded-full bg-secondary px-2.5 py-1">{l.source}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{fmtDate(l.created_at)}</span>
                {l.follow_up_date && <span className={`inline-flex items-center gap-1 ${overdue ? "text-amber-600 dark:text-amber-400 font-semibold" : ""}`}><CalendarClock className="h-3.5 w-3.5" />{fmtDate(l.follow_up_date)}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden max-md:border-0 max-md:bg-transparent">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-sm" data-testid="admin-lead-table">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Lead", "Requirement", "Budget", "Source", "Status", "Follow-up", "Received"].map((h) => <th key={h} className="px-4 py-3.5 font-medium whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((l) => {
                const overdue = l.follow_up_date && l.follow_up_date <= today() && !["Won", "Lost"].includes(l.status);
                return (
                  <tr key={l.id} onClick={() => setActiveId(l.id)} data-testid={`lead-row-${l.id}`} className="cursor-pointer hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-4 min-w-[200px]">
                      <p className="font-semibold flex items-center gap-2">{l.name}{l.consultation && <PhoneCall className="h-3.5 w-3.5 text-primary" aria-label="Consultation requested" />}</p>
                      <p className="text-xs text-muted-foreground">{l.company || "—"} · {l.phone}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{l.software_type}<p className="text-xs text-muted-foreground">{l.timeline}</p></td>
                    <td className="px-4 py-4 whitespace-nowrap font-mono text-xs">{l.budget}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{l.source}</td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <StatusSelect value={l.status} onChange={(s) => changeStatus(l, s)} testid={`lead-status-select-${l.id}`} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {l.follow_up_date ? <span className={`inline-flex items-center gap-1.5 text-xs ${overdue ? "text-amber-600 dark:text-amber-400 font-semibold" : ""}`}><CalendarClock className="h-3.5 w-3.5" />{fmtDate(l.follow_up_date)}</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-xs text-muted-foreground">{fmtDate(l.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && !leads.length && (
          <div className="py-20 text-center" data-testid="admin-leads-empty">
            <p className="font-display text-xl font-bold">No leads found</p>
            <p className="mt-2 text-sm text-muted-foreground">New enquiries from the website will appear here.</p>
          </div>
        )}
        {loading && !leads.length && <p className="py-16 text-center text-muted-foreground text-sm">Loading leads…</p>}
      </div>
      </>)}

      <LeadSheet lead={active} onClose={() => setActiveId(null)} onUpdate={upsert} onDelete={remove} canDelete={canDelete} />
    </div>
  );
};

export { StatusBadge };
