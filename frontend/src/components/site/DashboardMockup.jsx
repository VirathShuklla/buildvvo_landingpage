import { LayoutGrid, Package, Users, BarChart3, Settings, Bell, Search } from "lucide-react";

const bars = [38, 52, 44, 68, 58, 80, 72, 92, 76, 88, 96, 84];
const rows = [
  { id: "PO-2041", party: "Sharma Traders", amt: "₹1,24,500", s: "Approved", c: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { id: "PO-2040", party: "Metro Supplies", amt: "₹68,200", s: "Pending", c: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { id: "PO-2039", party: "Kiran Industries", amt: "₹2,05,000", s: "Dispatched", c: "bg-brand/15 text-brand" },
];

const Side = () => (
  <div className="hidden sm:flex w-14 flex-col items-center gap-4 border-r border-navy/10 dark:border-white/10 py-5">
    <div className="h-7 w-7 rounded-lg bg-brand grid place-items-center">
      <svg viewBox="0 0 32 32" className="h-4 w-4"><path d="M7 8l9 16 9-16" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    {[LayoutGrid, Package, Users, BarChart3, Settings].map((I, i) => (
      <I key={i} className={`h-4 w-4 ${i === 0 ? "text-brand" : "text-navy/35 dark:text-cream/35"}`} />
    ))}
  </div>
);

export const DashboardMockup = () => (
  <div data-testid="hero-dashboard-mockup" className="relative">
    <div className="absolute -inset-6 rounded-[36px] bg-brand/20 blur-3xl" />
    <div className="relative rounded-[22px] border border-navy/10 dark:border-white/10 bg-white dark:bg-[#0F1B31] shadow-[0_40px_80px_-30px_rgba(16,29,53,0.45)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-navy/10 dark:border-white/10 bg-cream/60 dark:bg-white/[0.03]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-3 flex-1 max-w-[260px] rounded-md bg-white dark:bg-white/5 px-3 py-1 font-mono text-[10px] text-navy/50 dark:text-cream/40 truncate">app.yourbusiness.in/operations</div>
      </div>
      <div className="flex text-navy dark:text-cream">
        <Side />
        <div className="flex-1 p-4 sm:p-6 space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-navy/45 dark:text-cream/40">Operations</p>
              <p className="font-display text-lg font-bold">Good morning, Priya</p>
            </div>
            <div className="flex gap-2">
              <span className="hidden sm:grid h-8 w-8 place-items-center rounded-lg border border-navy/10 dark:border-white/10"><Search className="h-3.5 w-3.5 opacity-50" /></span>
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-navy/10 dark:border-white/10"><Bell className="h-3.5 w-3.5 opacity-50" /></span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[["Orders today", "142", "+12%"], ["Stock alerts", "6", "Low"], ["Pending dues", "₹3.4L", "-8%"]].map(([l, v, d]) => (
              <div key={l} className="rounded-xl border border-navy/10 dark:border-white/10 p-2.5 sm:p-3.5">
                <p className="text-[9px] sm:text-[10px] text-navy/50 dark:text-cream/45 truncate">{l}</p>
                <p className="font-display text-base sm:text-xl font-bold mt-1">{v}</p>
                <p className="font-mono text-[9px] text-brand">{d}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-navy/10 dark:border-white/10 p-3.5">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-semibold">Revenue trend</p>
              <p className="font-mono text-[9px] text-navy/45 dark:text-cream/40">LAST 12 WEEKS</p>
            </div>
            <div className="flex items-end gap-1.5 h-20 sm:h-24">
              {bars.map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-[4px] bar-grow ${i === bars.length - 2 ? "bg-brand" : "bg-navy/10 dark:bg-white/10"}`} style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-navy/10 dark:border-white/10 divide-y divide-navy/5 dark:divide-white/5">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 px-3.5 py-2.5 text-[11px]">
                <span className="font-mono opacity-60">{r.id}</span>
                <span className="flex-1 truncate font-medium">{r.party}</span>
                <span className="hidden sm:inline font-mono">{r.amt}</span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${r.c}`}>{r.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="hidden md:block absolute -left-10 bottom-14 animate-floaty">
      <div className="rounded-2xl bg-navy text-cream dark:bg-cream dark:text-navy px-4 py-3 shadow-2xl w-52">
        <p className="font-mono text-[9px] uppercase tracking-widest opacity-60">Automation</p>
        <p className="text-sm font-semibold mt-1">Reorder alert sent to vendor</p>
        <p className="text-[10px] opacity-60 mt-0.5">via WhatsApp · just now</p>
      </div>
    </div>
    <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Illustrative interface</p>
  </div>
);
