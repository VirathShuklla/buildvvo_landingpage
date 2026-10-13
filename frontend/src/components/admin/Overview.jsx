import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Inbox, BadgeCheck, PhoneCall, TrendingUp, Trophy, CalendarClock, MessageCircle, Sparkles } from "lucide-react";
import { StatusBadge } from "./StatusControls";

const fmtShort = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const COLORS = ["#4965E9", "#101D35", "#22A06B", "#F5A524", "#E5484D", "#8B9BB4", "#A78BFA", "#14B8A6"];
const STATUS_COLORS = { New: "#4965E9", Contacted: "#8B9BB4", Qualified: "#F5A524", "Proposal Sent": "#A78BFA", Won: "#22A06B", Lost: "#E5484D" };

const Stat = ({ icon: I, label, value, hint, testid, accent }) => (
  <div data-testid={testid} className={`rounded-2xl border border-border p-4 sm:p-6 min-w-0 ${accent ? "bg-navy text-cream border-navy" : "bg-card"}`}>
    <div className="flex items-start justify-between gap-2">
      <p className={`text-xs sm:text-sm leading-snug ${accent ? "text-cream/70" : "text-muted-foreground"}`}>{label}</p>
      <I className={`h-4 w-4 shrink-0 ${accent ? "text-brand" : "text-primary"}`} />
    </div>
    <p className="mt-2 sm:mt-3 font-display text-2xl sm:text-4xl font-extrabold" data-testid={`${testid}-value`}>{value}</p>
    {hint && <p className={`mt-1 text-[11px] sm:text-xs ${accent ? "text-cream/50" : "text-muted-foreground"}`}>{hint}</p>}
  </div>
);

const Card = ({ title, children, className = "", testid }) => (
  <div data-testid={testid} className={`rounded-2xl border border-border bg-card p-4 sm:p-6 min-w-0 ${className}`}>
    <p className="font-display text-lg font-bold mb-5">{title}</p>
    {children}
  </div>
);

const tooltipStyle = { contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 } };

const Empty = () => <div className="h-[220px] grid place-items-center text-sm text-muted-foreground">No data yet</div>;

export const Overview = ({ stats, onGoLeads }) => {
  if (!stats) return <p className="text-muted-foreground">Loading analytics…</p>;
  const daily = stats.daily.map((d) => ({ ...d, label: d.date.slice(5) }));
  const sources = stats.by_source;
  return (
    <div className="space-y-6" data-testid="admin-overview">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Dashboard</p>
          <h1 className="text-2xl sm:text-4xl font-extrabold">Lead performance</h1>
        </div>
        {stats.follow_ups_due > 0 && (
          <button onClick={onGoLeads} data-testid="admin-followups-due-banner" className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-4 py-2 text-sm font-medium">
            <CalendarClock className="h-4 w-4" />{stats.follow_ups_due} follow-up{stats.follow_ups_due > 1 ? "s" : ""} due
          </button>
        )}
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat testid="stat-total-leads" icon={Inbox} label="Total leads" value={stats.total} hint={`${stats.new} new / unworked`} accent />
        <Stat testid="stat-qualified-leads" icon={BadgeCheck} label="Qualified leads" value={stats.qualified} hint={`${stats.qualification_rate}% of all leads`} />
        <Stat testid="stat-consultations" icon={PhoneCall} label="Consultations requested" value={stats.consultations} />
        <Stat testid="stat-conversion-rate" icon={TrendingUp} label="Conversion rate" value={`${stats.conversion_rate}%`} hint="Won ÷ total leads" />
      </div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat testid="stat-won" icon={Trophy} label="Won" value={stats.won} />
        <Stat testid="stat-win-rate" icon={Sparkles} label="Win rate (closed)" value={`${stats.win_rate}%`} hint="Won ÷ (Won + Lost)" />
        <Stat testid="stat-followups" icon={CalendarClock} label="Follow-ups due" value={stats.follow_ups_due} />
        <Stat testid="stat-whatsapp-clicks" icon={MessageCircle} label="WhatsApp clicks" value={stats.whatsapp_clicks} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Leads — last 30 days" className="lg:col-span-2" testid="chart-daily">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={daily} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4965E9" stopOpacity={0.35} /><stop offset="100%" stopColor="#4965E9" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} interval={4} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#4965E9" strokeWidth={2} fill="url(#gl)" />
              <Area type="monotone" dataKey="qualified" name="Qualified" stroke="#22A06B" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Lead sources" testid="chart-sources">
          {sources.length ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={sources} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {sources.map((s, i) => <Cell key={s.name} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-4 space-y-2 text-sm">
                {sources.map((s, i) => (
                  <li key={s.name} className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />{s.name}</span><span className="font-mono">{s.value}</span></li>
                ))}
              </ul>
            </>
          ) : <Empty />}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Pipeline by status" testid="chart-status">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.by_status.map((s) => ({ ...s, short: s.name === "Proposal Sent" ? "Proposal" : s.name === "Contacted" ? "Contact." : s.name }))} margin={{ left: -24, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="short" interval={0} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="value" name="Leads" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {stats.by_status.map((s) => <Cell key={s.name} fill={STATUS_COLORS[s.name]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Software requested" testid="chart-software">
          {stats.by_software.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.by_software} layout="vertical" margin={{ left: 0, right: 8 }}>
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="value" name="Leads" fill="#4965E9" radius={[0, 6, 6, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Recent enquiries" testid="overview-recent-leads">
          {stats.recent.length ? (
            <ul className="divide-y divide-border">
              {stats.recent.map((l) => (
                <li key={l.id}>
                  <button onClick={onGoLeads} className="w-full flex items-center justify-between gap-3 py-3 text-left hover:opacity-80 transition-opacity" data-testid={`overview-recent-${l.id}`}>
                    <span className="min-w-0">
                      <span className="block font-medium truncate">{l.name}</span>
                      <span className="block text-xs text-muted-foreground truncate">{l.software_type} · {l.budget} · {fmtShort(l.created_at)}</span>
                    </span>
                    <StatusBadge status={l.status} />
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="py-10 text-center text-sm text-muted-foreground">No enquiries yet. New leads from the website appear here.</p>}
        </Card>
        <Card title="Upcoming follow-ups" testid="overview-upcoming-followups">
          {stats.upcoming_follow_ups.length ? (
            <ul className="divide-y divide-border">
              {stats.upcoming_follow_ups.map((l) => {
                const overdue = l.follow_up_date <= new Date().toISOString().slice(0, 10);
                return (
                  <li key={l.id}>
                    <button onClick={onGoLeads} className="w-full flex items-center justify-between gap-3 py-3 text-left hover:opacity-80 transition-opacity">
                      <span className="min-w-0">
                        <span className="block font-medium truncate">{l.name}</span>
                        <span className="block text-xs text-muted-foreground truncate">{l.company || l.software_type}</span>
                      </span>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${overdue ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" : "bg-secondary"}`}>
                        <CalendarClock className="h-3.5 w-3.5" />{overdue ? "Due " : ""}{fmtShort(l.follow_up_date)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : <p className="py-10 text-center text-sm text-muted-foreground">No follow-ups scheduled. Set dates from a lead's detail panel.</p>}
        </Card>
      </div>

      <Card title="Budget distribution" testid="chart-budget">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.by_budget.map((b) => (
            <div key={b.name} className="rounded-xl bg-secondary/70 p-3 sm:p-4">
              <p className="text-xs text-muted-foreground">{b.name}</p>
              <p className="mt-1 font-display text-2xl font-extrabold">{b.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export { STATUS_COLORS };
